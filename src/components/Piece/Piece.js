import './Piece.css';

const Piece = (props) => {

    const handleClick = (props) => {
        props.onClick(props);
    };

    return (
        <div data-testid="divPiece" key={props.pieceKey ? props.pieceKey : ""}
            onClick={props.onClick ? () => handleClick(props) : null}
            className={`Piece ${props.className ? props.className : ""}`} >
        </div>
    )
}

export default Piece;