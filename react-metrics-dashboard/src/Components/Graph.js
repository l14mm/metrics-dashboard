import React from "react";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory";
import { withStyles } from "@material-ui/core";

const styles = {
  root: {
    textAlign: "center"
  }
};

const myTheme = VictoryTheme.default;
// myTheme.charcoal = "#252525";

const Graph = ({ classes, data, startTime }) => {
  return (
    data && (
      <div className={classes.root}>
        <VictoryChart
          // theme={VictoryTheme.material}
          theme={myTheme}
          // domainPadding={5}
          // minDomain={{
          //   x: new Date().setMinutes(new Date().getMinutes() - 100)
          // }}
          // minDomain={{ y: 651149056 }}
          // animate={{ duration: 500 }}
          // charcoal="#FF0000"
          // gray="#FF0000"
        >
          <VictoryLine
            data={data}
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
                        mutation: () => ({ style: { width: 50 } })
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
