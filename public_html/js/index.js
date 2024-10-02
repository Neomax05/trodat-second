const getProductsWithCategoriesAsync = async () => {
  try {
    const result = await fetchWithAuth({
      url: `${config.apiUrl}/api/products/categories`,
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
getProductsWithCategoriesAsync();
