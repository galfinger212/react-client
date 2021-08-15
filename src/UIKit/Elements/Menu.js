import { useEffect, useState, useRef } from 'react';

import { Line, Icon } from 'UIKit';
import './menu.css';

const menu = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const dropdownContainer = useRef();

    useEffect(() => {
        window.addEventListener('click', onCloseIsOpen);
        return () => {
            window.removeEventListener('click', onCloseIsOpen);
        }
    }, [])

    const handleHeaderClick = () => {
        setIsOpen(!isOpen)
    }
    const handleItemClick = (item) => {
        if (props.onChange) {
            props.onChange(item);
            if (item.props.to) {
                onCloseIsOpen();
            }
        }
    }

    const onCloseIsOpen = (e) => {
        if (dropdownContainer?.current?.contains(e?.target)) {

        } else {
            setIsOpen(false);
        }
    }
    const renderList = () => {
        if (isOpen && props.children) {
            return (
                <div data-testid="menuList" className="list">
                    {props.children ? props.children.map(item => <div className={item.props.enabled === false ? "disabled" : ""} key={item.key} onClick={item.props.enabled !== false ? () => { handleItemClick(item) } : null}>{item}</div>) : "aaaaa"}
                </div>
            )
        }
    }
    return (
        <div data-testid="menuDiv" className={`menu ${props.className}`} ref={dropdownContainer}>
            <div data-testid="menuHeaderDiv" className="header" onClick={handleHeaderClick}>
                <Line>
                    <span data-testid="menuTitleSpan" className="logo">{props.title ? props.title : ""}</span>
                    <Icon i={isOpen ? props.open : props.close} />
                </Line>
            </div>
            {renderList()}
        </div>
    )
}

export default menu;