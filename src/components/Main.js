require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');
var style = {
  display: 'none'
}
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'none'
    };
  }
  clickHandler () {
    this.setState({
      display: "block"
    });
  }
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" onClick={this.clickHandler.bind(this)}/>
        <div className="notice" style={this.state}>Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
