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

class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <figure className="img-figure">
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}
             title={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }

}

class GalleryByReactApp extends React.Component {
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
    let controllerUnits = [];
    let imgFigures = [];
    imageDatas.forEach(function(value) {
      imgFigures.push(<ImgFigure key={value.id} data={value} />);
    });

    return (
      <section className="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
