import './Grid.css';
const Grid = (props) => {
    return (
        <div data-testid="gridDiv" className={`Grid ${props.className}`} >
            {props.children}
        </div>
    )
}

export const Main = (props) => {
    return <Grid {...props} className="main" />
}

export default Grid;