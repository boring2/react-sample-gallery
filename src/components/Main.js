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
  return Math.ceil(Math.random() * (high - low) + low);
}

function get30DegRandom() {
  return ((Math.random() > 0.5) ? '' : '-') + Math.ceil(Math.random() * 30);
}

class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick (e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let styleObj = {};

    //如果props属性中指定了这张图片的位置,则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    //如果有旋转角度就旋转
    if (this.props.arrange.rotate) {
      (['MosTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
      styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
    // 如果是居中的图片， z-index设为11
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}
             title={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">
            {this.props.data.title}
          </h2>
          <div className="img-back" onClick={this.handleClick.bind(this)}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

//控制组件
class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(e) {
    //如果点击的是当前正在选中态的按钮,则翻转图片, 否则居中图片.
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    let controllerUnitClassName = "controller-unit";

    //如果对应的是居中图片, 显示控制按钮的翻转态
    if (this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center';
      //如果同时对应的是翻转图片,显示控制按钮的翻转态
      if (this.props.arrange.isInverse) {
        controllerUnitClassName += ' is-inverse';
      }
    }
    return (
      <span className= {controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
    );
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
          },
          rotate: 0,//旋转角度.
          isInverse: false, //是否翻转了
          isCenter: false
        }*/
      ]
    }
   
  }

  /**
   * [inverse 翻转图片]
   * @param  {[int]} index [输入当前被执行inverse操作的图片对应的图片信息数组的index值]
   * @return {[Function]}       [其内return一个真正待被执行的函数]
   */
  inverse (index) {
    return function () {
      const imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr
      })
    }.bind(this);
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
    const topImgNum = Math.random() > 0.5 ? 0 : 1;
    let topImgSpliceIndex = 0;

    const imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    1
    //首先居中centerIndex图片,居中的centerIndex图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    }

    //取出要布局上侧的图片状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    //如果生成的index和centerIndex一样,那重新生成.
    while(topImgSpliceIndex === centerIndex) {
      topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    }
    imgsArrangeTopArr  = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value) {
      value = {
        pos: {
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
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

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    }

    //合并回来
    if (imgsArrangeTopArr.length > 0) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr
    })
  }

  /**
   * [center 利用rearra函数, 居中对应的index的图片]
   * @param  {[int]} index [需要居中的图片index]
   * @return {[Function]}
   */
  center (index) {
    return function () {
      this.rearrange(index);
    }.bind(this);
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
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
    
      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
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
