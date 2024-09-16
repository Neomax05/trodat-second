import './style.scss';
import {useClassName} from '../../utils/cn';
import {forHome, forWork, recomended} from "./mockData";
import Category from "../../components/Category";

const StampCategory = () => {
    const cn = useClassName('stCategory');

    return (
        <div className={cn()}>
            <div className={cn('outlet-wrapper')}>
                <p className={cn('stampTitle')}>Категории штампов и печатей</p>
                <p className={cn('stampText')}>
                    Мы предлагаем полный комплекс диагностических, лечебных, эстетических
                    и хирургических стоматологических услуг.
                </p>
                <div className={cn('homeBlock')}>
                    <div className={cn('category')}>
                        <a href="#">
                            Для работы
                            <img src="/assets/img/stampCategory/Line.svg" alt="Line"/>
                        </a>

                        {forHome.map((obj, i) => {
                            return (
                                <Category key={i} {...obj}/>
                            )
                        })}

                    </div>
                    <div className={cn('category')}>
                        <a href="#">
                            Для дома
                            <img src="/assets/img/stampCategory/Line.svg" alt="Line"/>
                        </a>

                        {forWork.map((obj, i) => {
                            return (
                                <Category key={i} {...obj}/>
                            )
                        })}
                    </div>
                    <div className={cn('category')}>
                        <a href="#">
                            Рекомендуем
                            <img src="/assets/img/stampCategory/Line.svg" alt="Line"/>
                        </a>
                        {recomended.map((obj, i) => {
                            return (
                                <Category key={i} {...obj}/>
                            )
                        })}
                    </div>
                </div>
            </div>
            <button className={cn('catalog')}>Каталог</button>
        </div>
    );
};

export default StampCategory;
