import React, { Component } from "react";
import Graph from "./Graph";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = { metrics: null, refreshRate: 5, minutes: 5 };
    setInterval(
      () => this.getData(this.state.minutes),
      this.state.refreshRate * 1000
    );
    this.getData(1);
  }

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
  };

  setTime = e => {
    this.getData(e.currentTarget.value);
  };

  render() {
    const { metrics } = this.state;
    return <Graph metrics={metrics} setTime={() => this.setTime} />;
  }
}

export default Dashboard;
