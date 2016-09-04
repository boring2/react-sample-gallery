require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'
//获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');

//增加url信息.
imageDatas = (function genImageURL (imageDatasArr) {
  imageDatasArr.forEach(function (imageData) {
    imageData.imageURL = require('../images/' + imageData.fileName);
  });
  return imageDatasArr;
})(imageDatas);

/**
 * [获取区间内的一个随机值]
 * @param  {[int/float]} low  [小值]
 * @param  {[int/float]} high [大值]
 * @return {[int]}      [一个随机的数]
 */
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * high + low);
}

class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let styleObj = {};

    //如果props属性中指定了这张图片的位置,则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    return (
      <figure className="img-figure" style={styleObj}>
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
      imgsArrangeArr: [
        /*{
          pos: {
            left: '0',
            top: '0'
          }
        }*/
      ]
    }
   
  }

  

  /**
   * 重新布局所有图片
   * @param  {[int]} centerIndex [居中的index]
   * @return {[type]}             [description]
   */
  rearrange (centerIndex) {
    const imgsArrangeArr = this.state.imgsArrangeArr;
    const Constant = GalleryByReactApp.defaultProps.Constant;
    const centerPos = Constant.centerPos;
    const hPosRange = Constant.hPosRange;
    const vPosRange = Constant.vPosRange;
    const hPosRangeLeftSecX = Constant.hPosRange.leftSecX;
    const hPosRangeRightSecX = Constant.hPosRange.rightSecX;
    const hPosRangeY = hPosRange.y;
    const vPosRangeX = vPosRange.x;
    const vPosRangeTopY = vPosRange.topY;
    let imgsArrangeTopArr = [];
    //取一个或者不取放在上方
    const topImgNum = Math.ceil(Math.random() * 2);
    let topImgSpliceIndex = 0;

    const imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    
    //首先居中centerIndex图片
    imgsArrangeCenterArr[0].pos = centerPos;

    //取出要布局上侧的图片状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr  = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value) {
      value.pos = {
        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
        top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
      }
    });
    //布局左右两侧的图片
    for (let i = 0, l = imgsArrangeArr.length, k = l / 2; i < l; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边, 右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i].pos = {
        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
      }
    }

    //合并回来
    if (imgsArrangeTopArr.length) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr
    })
  }
  componentDidMount() {
    const constant = GalleryByReactApp.defaultProps.Constant;
    const stageDOM = ReactDOM.findDOMNode(this.refs.stage);
    const stageW = stageDOM.scrollWidth;
    const stageH = stageDOM.scrollHeight;
    const halfStageW = Math.ceil(stageW / 2);
    const halfStageH = Math.ceil(stageH / 2);

    //取一个imageFigure的大小
    const imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);

    const imgW = imgFigureDOM.scrollWidth;
    const imgH = imgFigureDOM.scrollHeight;
    const halfImgW = Math.ceil(imgW / 2);
    const halfImgH = Math.ceil(imgH / 2);

    /* 计算constant的值 */
    //计算中心图片的位置点
    constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    //计算左分区x
    constant.hPosRange.leftSecX[0] = -halfImgW;
    constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

    //计算右分区x
    constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    constant.hPosRange.rightSecX[1] = stageW - halfImgW;

    //计算左右分区y
    constant.hPosRange.y[0] = -halfImgH;
    constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上分区
    constant.vPosRange.x[0] = halfStageW - imgW;
    constant.vPosRange.x[1] = halfStageW;
    constant.vPosRange.topY[0] = -halfImgH;
    constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    //摆图片
    this.rearrange(0);

  }

  

  render() {
    let controllerUnits = [];
    let imgFigures = [];
    imageDatas.forEach(function(value, index) {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          }
        }
      }
      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} />);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
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
 Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {    //水平方向的取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {    //垂直方向的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  }
};

export default GalleryByReactApp;
