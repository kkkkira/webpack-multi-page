# webpack-multi-page
a multi-page application base on Webpack, jQuery library, Less.js and Jade template engine

这是一个基于webpack的多页应用。使用jade模板引擎解析html, less.js编辑样式，并引入jquery库，方便在一些老项目中提高开发效率。该应用已经实现：
- [x] ES6编译
- [x] less预处理
- [x] 引入jquery，并配置了jquery的全局变量，在项目中可以直接使用 `$`使用jquery
- [x] 引入jade模板引擎，配置好相关loader，最终会打包成html
- [x] 多页应用的路径配置
- [x] 开发环境和生成环境搭建
- [x] 图片资源引入，已经公共资源的提取合并 

## 步骤
    $ git clone https://github.com/kkkkira/webpack-multi-page.git
    $ cd webpack-multi-page
    $ npm install                   
    $ npm start
    打开 http://localhost:8080/welcome 查看

