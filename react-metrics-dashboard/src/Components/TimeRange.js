import React, { Component } from "react";
import { Button, withStyles } from "@material-ui/core";

const styles = {
  button: {
    fontSize: "16px"
  }
};

function createTimeRangeButton(seconds, text, classes, setTime) {
  return (
    <Button
      color="primary"
      className={classes.button}
      value={seconds}
      onClick={setTime()}
      key={text}
    >
      {text}
    </Button>
  );
}

const TimeRange = ({ classes, setTime }) => {
  let timeRanges = [
    [1, "1m"],
    [5, "5m"],
    [10, "10m"],
    [30, "30m"],
    [1 * 60, "1h"],
    [2 * 60, "2h"],
    [3 * 60, "3h"]
  ];
  return (
    <>
      {timeRanges.map(range =>
        createTimeRangeButton(range[0], range[1], classes, setTime)
      )}
    </>
  );
};

export default withStyles(styles)(TimeRange);
