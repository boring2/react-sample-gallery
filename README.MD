# 本demo学习来自慕课网的Materliu老师.感谢.

# autoprefixer已经deprecated,提示安装postcss-loader
npm WARN deprecated autoprefixer-loader@3.2.0: Please use postcss-loader instead of autoprefixer-loder

# 安装完post-loader后, 改掉文件名app.css -> app.scss, 将Main.js中的require('styles/App.css') -> require('styles/App.scss'),出现以下error.
ERROR in ./src/components/Main.js
Module not found: Error: Cannot resolve module 'sass-loader' in D:\workspace\react-sample-gallery\src\components

# 于是安装了sass-loader
npm install sass-loader --save-dev

# 装完后保存Main.js, 又提示node-sass不存在error
npm install node-sass --save-dev

# 用postcss-loader设置autoprefixer, 查看文档发现.依赖precss和autoprefixer.于是安装;
npm install precss --save-dev
npm install autoprefixer --save-dev

# 配置postcss-loader(autoprefixer)
1.目录cfg下的defaults.js中修改
```javascript
...
test: /\.scss/,
loader: 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=expanded'
```

2.目录cfg的base.js文件的module{}后加入如下代码, autoprefixer才能工作
```javascript
...
module :{},
postcss: function () {
  return [precss, autoprefixer];
  }
```

# 用forEach改写了mater老师的imageDatas
```javascript
imageDatas = (function genImageURL (imageDatasArr) {
  imageDatasArr.forEach(function (imageData) {
    imageData.imageURL = require('../images/' + imageData.fileName);
  });
  return imageDatasArr;
})(imageDatas);
```
# 做到3-2时 有一个警告信息 
Warning: Each child in an array or iterator should have a unique “key” prop.
stackoverflow后发现是react为了渲染性能需要给每个迭代的孩子加唯一的key值.于是我在forEach中加入index.相应代码改成如下;
```javascript
imageDatas.forEach(function(value, index) {
  imgFigures.push(<ImgFigure key={index} data={value} />);
  });
```
# 做到3-4时报错
1.Uncaught TypeError: _react2.default.findDOMNode is not a function
由于react版本问题,已经迁移到react-dom包中,所有改用
```javascript
import ReactDOM from 'react-dom'
const stageDOM = ReactDOM.findDOMNode(this.refs.stage);
const imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigures0);
```
2.把Constant部分放到下面代码中, 因为Constant应该不属于实例属性.没有必要定义在类中.
```javascript
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
```











