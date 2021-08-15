import "./topbar.css";
import { Person, Chat } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { Menu, Line } from 'UIKit';
import { useRef } from 'react';

const Topbar = ({ initUser, initHistory }) => {
  const currentRout = useRef("/");
  const user = useRef(initUser);
  const history = useRef(initHistory);

  const changeHistory = (toValue) => {
    history.current.push(toValue);
    currentRout.current = toValue;
  };

  const handleOnChange = (item) => {
    if (item.props.className) {
      changeHistory(item.props.to);
    }
  }

  return (
    <div data-testid="topbarContainer" className="topbarContainer">
      <div data-testid="topbarLeft" className="topbarLeft">
        <Line justify="between">
          <Line>
            <Menu title="Sela TalkBack" open="chevron-up" close="chevron-down" onChange={handleOnChange}>
              <Line enabled={user.current ? true : false} to="/" key="1" className="submenu" >
                Home
              </Line>
              <Line to={user.current ? "/signOut" : "/login"} key="2" className="submenu" >
                {user.current ? "Sign Out" : <span className="topbarLink">Log in</span>}
              </Line>
              <Line key="3" className="submenu" >
                Actions
                <Menu className="menu2" open="chevron-left" close="chevron-right" onChange={handleOnChange} >
                  <Line enabled={user.current ? true : false} to="SendMessage" key="1" className="submenu" >Send Message</Line>
                  <Line enabled={user.current ? true : false} to="Backgammon" key="2" className="submenu" >Play Backgammon</Line>
                </Menu>
              </Line>
              <Line key="4" className="submenu">
                Help
                <Menu className="menu2" open="chevron-left" close="chevron-right" onChange={handleOnChange} >
                  <Line to="HowToPlay" key="1" className="submenu" >How To Play</Line>
                  <Line to="About" key="2" className="submenu" >About</Line>
                </Menu>
              </Line>
            </Menu>
          </Line>
          <Line>
          </Line>
        </Line>
      </div>
      <div data-testid="topbarRight" className="topbarRight">
        <div data-testid="topbarLinks" className="topbarLinks">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="topbarLink">Homepage</span>
          </Link>
        </div>
        <div data-testid="topbarIcons" className="topbarIcons">
          <div data-testid="topbarIconItem" className="topbarIconItem">
            <Person />
          </div>
          <div data-testid="topbarIconItem" className="topbarIconItem">
            <Link to="/sendMessage" style={{ textDecoration: "none" }}>
              <Chat />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;