import './Triangle.css';

const Triangle = (props) => {
    const handleClick = (props) => {
        props.onClick(props);
    };
    return (
        <div data-testid="triangleDiv" onClick={props.onClick ? () => handleClick(props) : null} className={`${props.className}`} >
        </div>
    );
}

export default Triangle;