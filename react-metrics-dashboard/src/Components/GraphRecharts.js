import React from "react";
import moment from "moment";
import {
  LineChart,
  Line,
  AreaChart,
  ReferenceLine,
  Area,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { withStyles } from "@material-ui/core";

const styles = {
  root: {
    textAlign: "center",
    width: "100%",
    height: "100%"
  }
};

const Graph = ({ classes, data, startTime }) => {
  console.log(data);
  return (
    data && (
      <div className={classes.root}>
        <ResponsiveContainer width="95%" height="95%">
          <LineChart
            data={data}
            isAnimationActive={false}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              domain={["auto", "auto"]}
              name="Time"
              tickFormatter={unixTime => moment(unixTime).format("HH:mm")}
              scale="time"
              type="number"
            />
            <YAxis />
            <Tooltip cursor={false} />
            <Legend />
            <Line type="monotone" dataKey="y" stroke="#34495e" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  );
};

export default withStyles(styles)(Graph);
