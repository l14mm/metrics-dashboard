import React from "react";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory";
import { Button, withStyles } from "@material-ui/core";

const styles = {
  root: {
    textAlign: "center"
  },
  button: {
    fontSize: "16px"
  }
};

const Graph = ({ classes, metrics, setTime }) => {
  return (
    metrics && (
      <div className={classes.root}>
        <Button
          color="primary"
          className={classes.button}
          value={1}
          onClick={setTime()}
        >
          1m
        </Button>
        <Button
          color="primary"
          className={classes.button}
          value={5}
          onClick={setTime()}
        >
          5m
        </Button>
        <Button
          className={classes.button}
          color="primary"
          value={10}
          onClick={setTime()}
        >
          10m
        </Button>
        <Button
          className={classes.button}
          color="primary"
          value={30}
          onClick={setTime()}
        >
          30m
        </Button>
        <Button
          className={classes.button}
          color="primary"
          value={60}
          onClick={setTime()}
        >
          1h
        </Button>
        <VictoryChart theme={VictoryTheme.material} animate={{ duration: 500 }}>
          <VictoryLine
            data={metrics}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onClick: () => {
                    return [
                      {
                        target: "data",
                        eventKey: "all",
                        mutation: () => {
                          return { style: { stroke: "black", strokeWidth: 5 } };
                        }
                      }
                    ];
                  },
                  onMouseOver: () => {
                    return [
                      {
                        target: "data",
                        mutation: () => ({ style: { width: 30 } })
                      }
                    ];
                  },
                  onMouseOut: () => {
                    return [
                      {
                        target: "data",
                        mutation: () => {}
                      }
                    ];
                  }
                }
              }
            ]}
          />
        </VictoryChart>
      </div>
    )
  );
};

export default withStyles(styles)(Graph);
