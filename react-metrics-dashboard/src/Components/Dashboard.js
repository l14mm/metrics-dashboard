import React, { Component } from "react";
import Graph from "./Graph";
import { Responsive, WidthProvider } from "react-grid-layout";
import TimeRange from "./TimeRange";
import GraphRecharts from "./GraphRecharts";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function abbreviate(number, maxPlaces, forcePlaces, forceLetter) {
  number = Number(number);
  forceLetter = forceLetter || false;
  if (forceLetter !== false) {
    return annotate(number, maxPlaces, forcePlaces, forceLetter);
  }
  var abbr;
  if (number >= 1e12) {
    abbr = "T";
  } else if (number >= 1e9) {
    abbr = "B";
  } else if (number >= 1e6) {
    abbr = "M";
  } else if (number >= 1e3) {
    abbr = "K";
  } else {
    abbr = "";
  }
  return annotate(number, maxPlaces, forcePlaces, abbr);
}

function annotate(number, maxPlaces, forcePlaces, abbr) {
  // set places to false to not round
  var rounded = 0;
  switch (abbr) {
    case "T":
      rounded = number / 1e12;
      break;
    case "B":
      rounded = number / 1e9;
      break;
    case "M":
      rounded = number / 1e6;
      break;
    case "K":
      rounded = number / 1e3;
      break;
    case "":
      rounded = number;
      break;
  }
  if (maxPlaces !== false) {
    var test = new RegExp("\\.\\d{" + (maxPlaces + 1) + ",}$");
    if (test.test("" + rounded)) {
      rounded = rounded.toFixed(maxPlaces);
    }
  }
  if (forcePlaces !== false) {
    rounded = Number(rounded).toFixed(forcePlaces);
  }
  return rounded + abbr;
}

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      metrics: null,
      refreshRate: 5,
      minutes: 5,
      layouts: [
        { x: 1, y: 2, w: 1, h: 2, i: "1" },
        { x: 1, y: 2, w: 2, h: 2, i: "2" },
        { x: 1, y: 2, w: 4, h: 2, i: "3" }
      ]
    };
  }

  componentDidMount = () => {
    setInterval(
      () => this.getData(this.state.minutes),
      this.state.refreshRate * 1000
    );
    this.getData(100);
  };

  getData = minutes => {
    let end = new Date();
    let start = new Date();
    start.setMinutes(end.getMinutes() - minutes);
    this.setState({ minutes });

    fetch(
      `http://localhost:3001/?start=${start.toISOString()}&end=${end.toISOString()}`
    )
      .then(resp => resp.json())
      .then(json => {
        const metric = json.find(item => item.metric.word === "morning");
        var metrics = metric.values.map(item => ({
          x: new Date(item[0] * 1000),
          y: parseInt(item[1])
        }));
        this.setState({
          metrics
        });
      })
      .catch(err => console.log(err));

    console.log(
      `http://localhost:9090/api/v1/query_range?query=node_memory_Active_anon_bytes&start=${start.toISOString()}&end=${end.toISOString()}&step=1s`
    );
    fetch(
      `http://localhost:9090/api/v1/query_range?query=node_memory_Active_anon_bytes&start=${start.toISOString()}&end=${end.toISOString()}&step=1s`
    )
      .then(resp => resp.json())
      .then(json => {
        const metrics2 = json.data.result[0].values.map(item => ({
          x: new Date(item[0] * 1000),
          y: parseInt(item[1]) / 1000000
          // y: abbreviate(parseInt(item[1]))
        }));
        const metrics3 = json.data.result[0].values.map(item => ({
          x: item[0] * 1000,
          y: parseInt(item[1]) / 1000000
        }));
        // console.log(metrics);
        this.setState({
          metrics2,
          metrics3
        });
      })
      .catch(err => console.log("error", err));
  };

  setTime = e => {
    this.getData(e.currentTarget.value);
  };

  onLayoutChange(layout) {
    // this.props.onLayoutChange(layout);
    console.log(layout);
  }

  render() {
    const { metrics, metrics2, metrics3 } = this.state;
    return (
      <>
        <TimeRange setTime={() => this.setTime} />
        {metrics2 && (
          <ResponsiveReactGridLayout
            className="layout"
            // layouts={this.state.layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            onLayoutChange={this.onLayoutChange}
          >
            <div
              key="1"
              data-grid={{ w: 5, h: 3, x: 0, y: 0, minW: 3, minH: 2 }}
              style={{
                backgroundColor: "white",
                border: "black 2px solid"
              }}
            >
              <Graph data={metrics2} />
            </div>
            <div
              key="2"
              data-grid={{ w: 5, h: 3, x: 5, y: 0, minW: 3, minH: 2 }}
              style={{
                backgroundColor: "white",
                border: "black 2px solid"
              }}
            >
              <GraphRecharts data={metrics3} />
            </div>
          </ResponsiveReactGridLayout>
        )}
      </>
    );
  }
}

export default Dashboard;
