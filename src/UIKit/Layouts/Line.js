import './Line.css';

const Line = (props) => {
    return (
        <div data-testid="LineDiv" className={`Line ${props.className}`} justify={props.justify}>
            {props.children}
        </div>
    )
}

export default Line;