import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Footer from "./Components/Footer";
import Header from "./Components/Header";

const theme = createMuiTheme({
  palette: {
    background: "white",
    primary: { main: "#333" },
    secondary: { main: "#333" }
  },
  typography: {
    useNextVariants: true,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 10
  }
});

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Header search={() => this.search} />
          <main style={{ textAlign: "center" }}>Hello World!</main>
          <Footer />
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;
