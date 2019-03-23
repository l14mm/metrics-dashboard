import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  appBar: {
    position: "relative"
  },
  grow: {
    flexGrow: 1,
    textAlign: "center"
  }
};

const Header = ({ classes, search }) => {
  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography
          variant="h4"
          color="inherit"
          className={classes.grow}
          noWrap
        >
          Metrics Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(Header);
