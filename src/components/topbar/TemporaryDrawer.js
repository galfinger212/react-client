import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import MessageIcon from '@material-ui/icons/Message';
import HomeIcon from '@material-ui/icons/Home';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useRef } from 'react';

const useStyles = makeStyles({
    list: {
        width: 200,
    }
});

export default function TemporaryDrawer({ initUser, initHistory }) {
    const classes = useStyles();
    const currentRout = useRef("/");
    const user = useRef(initUser);
    const history = useRef(initHistory);

    const handleOnClick = (event, to) => {
        history.current.push(to);
        currentRout.current = to;
    }

    const [state, setState] = React.useState({
        left: false
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list)}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)} >
            <List>
                <ListItem button onClick={(event) => handleOnClick(event, "/")} key={0}>
                    <ListItemIcon> <HomeIcon /></ListItemIcon>
                    <ListItemText primary={"Home Page"} />
                </ListItem>
                <ListItem onClick={(event) => handleOnClick(event, "/About")} button key={1}>
                    <ListItemIcon> <QuestionAnswerIcon /></ListItemIcon>
                    <ListItemText primary={"About us"} />
                </ListItem>
                <ListItem onClick={(event) => handleOnClick(event, "/HowToPlay")} button key={2}>
                    <ListItemIcon> <HowToRegIcon /></ListItemIcon>
                    <ListItemText primary={"How to play?"} />
                </ListItem>
            </List>
            <Divider />
            <List>
                {user.current ? <ListItem onClick={(event) => handleOnClick(event, "/SendMessage")} button key={3}>
                    <ListItemIcon> <MessageIcon /></ListItemIcon>
                    <ListItemText primary={"Send message"} />
                </ListItem> : ""}
                {user.current ? <ListItem onClick={(event) => handleOnClick(event, "/SignOut")} button key={4}>
                    <ListItemIcon> <ExitToAppIcon /></ListItemIcon>
                    <ListItemText primary={"Sign Out"} />
                </ListItem> : <ListItem onClick={(event) => handleOnClick(event, "/login")} button key={5}>
                    <ListItemIcon> <ExitToAppIcon /></ListItemIcon>
                    <ListItemText primary={"Sign In"} />
                </ListItem>}
            </List>
        </div>
    );

    return (
        <div>
            <React.Fragment key={"left"}>
                <Button onClick={toggleDrawer("left", true)}>
                    <MenuIcon />
                </Button>
                <Drawer anchor={"left"} open={state["left"]} onClose={toggleDrawer("left", false)}>
                    {list("left")}
                </Drawer>
            </React.Fragment>
        </div>
    );
}