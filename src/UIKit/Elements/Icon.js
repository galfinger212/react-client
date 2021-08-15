const Icon = (props) => {
    return (
        <div data-testid="IconDiv" className="Icon">
            <i data-testid="IconImageDiv" className={`${props.i ? `fas fa-${props.i}` : ""}`}></i>
        </div>
    );
}

export default Icon;