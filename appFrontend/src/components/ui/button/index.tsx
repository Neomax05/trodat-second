import {useClassName} from "../../../utils/cn";
import Icon from "../icon";
import "./index.scss"

export const Button = ({title = "", icon = ""}) => {
    const cn = useClassName('button');


    return (
        <button className={cn()} style={title ? {padding: '0 20px'} : {}}>
            {title && <span>{title}</span>}
            {icon && <Icon name={icon}/>}
        </button>
    );
};