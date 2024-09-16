import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {Browser, chromium} from "playwright";
import { AppModule } from 'src/app.module';
import { AppConfig } from 'src/modules/config/configs';
import { ProductsService } from 'src/modules/products/products.service';
import { IntegrationProduct } from '../types/integration.type';


@Injectable()
export class Parser {
  private browser: Browser;
  private productService: ProductsService;
  private logger: Logger;

  constructor(productService: ProductsService) {
    this.logger = new Logger('Parser');
    this.productService = productService;
  }

  async init() {
    this.browser = await chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
  }

  async clearResources() {
    console.log('Clearing resources and cache...');
    if (this.browser) {
      const contexts = this.browser.contexts();
      for (const context of contexts) {
        await context.clearCookies();
        await context.clearPermissions();
        await context.close(); // Закрываем все контексты
      }
    } else {
      console.warn('Browser instance is not initialized.');
    }
  }


  async parseTrodat2(article: string): Promise<{ description: string, size: string }> {
    try {
      console.log('parseTrodat2 method called', article);
      if (!this.browser) {
        throw new InternalServerErrorException('Browser not initialized');
      }
      const page = await this.browser.newPage();
      await page.goto('https://trodat-russia.ru/search/');
      const filterCatalog = await page.$('#filter_3');
      await filterCatalog.click();
      const searchInput = await page.$('body > main > div > div > form > input');
      await searchInput.fill(article);
      const searchButton = await page.$('body > main > div > div > form > button');
      await searchButton.click();
      console.log('test 1');
      await page.waitForLoadState("networkidle");
      const answerArr = await page.$$('body > main > div > div > ul > li > h3 > a');
      console.log(`We found ${answerArr.length} products`);
      if (!answerArr.length) {
        this.logger.warn('No element was found');
        await page.close();
        return { description: '', size: '' };
      }
      let usingIndex = 0;
      for (const [i, answer] of answerArr.entries()) {
        const productTitle = await answer.textContent();
        console.log(`Product ${i + 1} - ${productTitle}`);
        if (productTitle === article) usingIndex = i;
      }
      const firstEl = answerArr[usingIndex];
      const a = await firstEl.textContent();
      console.log('a', a);
      await firstEl.click();
      await page.waitForLoadState('domcontentloaded');
      await page.evaluate(() => {
        const aboutTitle = document.querySelector('body > main > div > div > div.product > div.product-description > div.product-text > h4');
        if (aboutTitle) aboutTitle.remove();
      });
      const productDescriptionElement = await page.$('body > main > div > div > div.product > div.product-description > div.product-text');
      const productDescription = productDescriptionElement ? await productDescriptionElement.innerText() : '';
      const normalizeDescription = productDescription.replace(/\n/g, ' ');
      const sizeEl = await page.$('body > main > div > div > div.product > div.product-description > div.features > div > div:nth-child(1) > div:nth-child(3) > span');
      const size = sizeEl ? await sizeEl.textContent() : '';
      console.log('test 2');
      this.logger.log('Parser successfully end');
      await page.close();
      return { description: normalizeDescription || '', size: size || '' };
    } catch (error) {
      console.error('Error in parseTrodat2:', error);
      throw new InternalServerErrorException('Error in parseTrodat2');
    } finally {
      await this.clearResources();
    }
  }

  async parseTrodat() {
    this.logger = new Logger('Parser');
    const app = await NestFactory.createApplicationContext(AppModule);
    const appConfig = app.get(AppConfig);

    console.log("appConfig", appConfig);

    this.productService = app.get<ProductsService>(ProductsService);
    this.browser = await chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await this.browser.newPage();
    await page.goto(appConfig.parse_url);
    const orderManagerContent = await page.$('.div-footer-right .footer-block-content');
    const links = await orderManagerContent.$$eval('a', anchors => anchors.map(anchor => anchor.href));
    const linksParsed = links.slice(0, 3);
    console.log(linksParsed);

    for (const link of linksParsed) {
      await page.goto(link);

      const good: IntegrationProduct = {
        goodID: await page.$eval('.goodID', el => el.textContent) || '',
        name: await page.$eval('.name', el => el.textContent) || '',
        description: await page.$eval('.description', el => el.textContent) || '',
        article: await page.$eval('.article', el => el.textContent) || '',
        ownerID: await page.$eval('.ownerID', el => el.textContent) || '',
        sku: '',
        type: 0,
        vat: '',
        st: '',
        barcode: '',
        markType: 0,
        measureCode: '',
        measureName: '',
        originCountry: '',
        imageBase64: '',
        imagesBase64: [],
      };

      const product = await this.productService.checkIsProductExist(good);
      if (product) {
        this.logger.log(`Product ${good.name} already exists`);
        continue;
      }
      this.logger.log(`Saving product!!!!!!!!!!!!!!!!!: ${good.name}`);

      await this.productService.createProduct1C(good);
    }
  }



  private async categoryParse(links) {
    const products = [];
    for (const link of links) {
      const productPage = await this.browser.newPage();
      try {
        await productPage.goto(link.url);
        const categoryManager = await productPage.$('.div-box-category');
        if (categoryManager) {
          const categoryLinks = await productPage.$$eval('.div-content-category', (elements) => {
            return elements.map((element) => {
              const anchorElement = element as HTMLAnchorElement;
              return anchorElement.href;
            });
          });

          const productLinks = await this.parseCategoryLinks(productPage, categoryLinks);
          await this.parseProducts(productPage, productLinks);
        } else {
          await productPage.goto(link.url);
          const productLinks = await productPage.evaluate(() => {
            const buttons = document.querySelectorAll('.div-content-products .button-newsbox');
            const linksArray = [];
            buttons.forEach((button) => {
              const href = button.getAttribute('href');
              linksArray.push(href);
            });
            return linksArray;
          });

          await this.parseProducts(productPage, productLinks);
        }
      } catch (error) {
        console.log(error);
        this.logger.error('Error processing category:', link.category);
      } finally {
        await productPage.close();
      }
    }
    return products;
  }

  private async parseCategoryLinks(productPage, categoryLinks) {
    let linksProduct = [];
    for (const categoryLink of categoryLinks) {
      await productPage.goto(categoryLink);
      await productPage.select('.div-shopnav-right .ergebnisse-left .selector_shopnav .select-field-2', '9999');
      const productLinks = await productPage.evaluate(() => {
        const buttons = document.querySelectorAll('.div-content-products .button-newsbox');
        const linksArray = [];
        buttons.forEach((button) => {
          const href = button.getAttribute('href');
          linksArray.push(href);
        });
        return linksArray;
      });
      linksProduct = linksProduct.concat(productLinks);
    }
    return linksProduct;
  }

  private async parseProducts(productPage, linksProduct) {
    for (const linkProduct of linksProduct) {
      await productPage.goto(linkProduct);
      const product_id = await productPage.$eval('.h1-product', (element) => element.textContent.trim());
      const product_name = await productPage.$eval('.sl-product', (element) => element.textContent.trim());
      const product_images = await productPage.$$eval('.div-image-productdetail-slider img', (images) => {
        return images.map((img) => img.src);
      });
      await this.productService.createParsedProduct({
        product_id: product_id,
        name: product_name,
        images: product_images,
      });
    }
  }
}








