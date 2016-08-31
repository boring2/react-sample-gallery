require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');

//增加url信息.
imageDatas = (function genImageURL (imageDatasArr) {
  imageDatasArr.forEach(function (imageData) {
    imageData.imageURL = require('../images/' + imageData.fileName);
  });
  return imageDatasArr;
})(imageDatas);


class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'block'
    };
    // this.clickHandler = this.clickHandler.
  }
  clickHandler() {
    this.setState({
      display: 'none'
    });
  }
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
