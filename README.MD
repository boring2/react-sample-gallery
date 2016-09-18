### 本demo学习来自慕课网的Materliu老师.感谢.

### autoprefixer已经deprecated,提示安装postcss-loader
npm WARN deprecated autoprefixer-loader@3.2.0: Please use postcss-loader instead of autoprefixer-loder

### 安装完post-loader后, 改掉文件名app.css -> app.scss, 将Main.js中的require('styles/App.css') -> require('styles/App.scss'),出现以下error.
ERROR in ./src/components/Main.js
Module not found: Error: Cannot resolve module 'sass-loader' in D:\workspace\react-sample-gallery\src\components

### 于是安装了sass-loader
npm install sass-loader --save-dev

### 装完后保存Main.js, 又提示node-sass不存在error
npm install node-sass --save-dev

### 用postcss-loader设置autoprefixer, 查看文档发现.依赖precss和autoprefixer.于是安装;
npm install precss --save-dev
npm install autoprefixer --save-dev

### 配置postcss-loader(autoprefixer)
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

### 用forEach改写了mater老师的imageDatas
```javascript
imageDatas = (function genImageURL (imageDatasArr) {
  imageDatasArr.forEach(function (imageData) {
    imageData.imageURL = require('../images/' + imageData.fileName);
  });
  return imageDatasArr;
})(imageDatas);
```
### 做到3-2时 有一个警告信息 
Warning: Each child in an array or iterator should have a unique “key” prop.
stackoverflow后发现是react为了渲染性能需要给每个迭代的孩子加唯一的key值.于是我在forEach中加入index.相应代码改成如下;
```javascript
imageDatas.forEach(function(value, index) {
  imgFigures.push(<ImgFigure key={index} data={value} />);
  });
```
### 做到3-4时报错
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

### 第二部分1-1, 加上厂商前缀时报错.
warning.js?8a56:36Warning: Unsupported style property -mos-transfrom. Did you mean MosTransfrom? Check the render method of `ImgFigure`.
所以我改成了
```javascript
(['MosTransfrom', 'msTransfrom', 'WebkitTransfrom', 'transfrom']).forEach(
  function (value) {
    styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
  }.bind(this));
```

### 老师漏讲了一节图片翻转的课程.可根据github上的源码分析.主要是加了img-back的css.

### bug修复
1.centerIndex 和 topImgSpliceIndex 可能会随机生成一样的,所以可能会导致中心图片有两张
```javascript
//如果一样就重新生成.
while(topImgSpliceIndex === centerIndex) {
  topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
}
```

2.var topImgNum = Math.ceil(Math.random() * 2)产生的随机数可能是1 或 2, 但是合并回去的时候只合并了一个imgsArrangeTopArr[0]
```javascript
imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
```
导致元素缺失一个.
解决办法:
要么在合并时用
```javascript
imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr);
```

要么在生成时用
```javascript
const topImgNum = Math.random() > 0.5 ? 0 : 1;
```

### grunt serve:dist 用npm run serve:dist代替

### 将代码推到gh-pages的方法

#### 因为我没装sub-tree,所以用自己的方法推到gh-pages中
+ 1. cd dist
+ 2. git init
+ 3. git checkout --orphan gh-pages
+ 4. git add .
+ 5. git commit -m 'create gh-pages'
+ 6. git remote add origin git@github.com:username/project.git
+ 7. git push origin gh-pages
+ 8. 在github中代码目录的settings项里把GitHub Pages设置为gh-pages

### ps: 上传后发现的有资源找不到(404. /assets/app.js)之类的提示可以可以直接修改index.html文件中的src(把'/assets/app.js'改为'assets/app.js').

[demo演示](http://boring2.github.io/react-sample-gallery)

















