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

# 用postcss-loader设置autoprefixer,查看文档发现.依赖precss和autoprefixer.于是安装;
npm install precss --save-dev
npm install autoprefixer --save-dev

# 配置autoprefixer,在目录cfg下的base.js文件的module{}后加入如下代码
```javascript
...
module :{},
postcss: function () {
  return [precss, autoprefixer];
  }
```












