import {useClassName} from "../../utils/cn";
import './style.scss'

const Category = ({title = '', image = '', count = 0}) => {
    const cn = useClassName('categoryCard');

    return (
        <div className={cn()}>
            <div className={cn('image')}>
                <img src={image} alt=""/>
            </div>
            <div>
                <p>{title}</p>
                <div className={cn('action')}>
                    <button>подробнее</button>
                    <div>{count}</div>
                </div>
            </div>
        </div>

    )
}

export default Category