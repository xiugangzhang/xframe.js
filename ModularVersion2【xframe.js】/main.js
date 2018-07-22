/**
 * @Desc : 主要的功能模块展示
 * @Author : xiugang
 * @Time : 20180722
 */
//配置项，在主入口js文件配置即可，其他模块都可调用paths模块
require.config({
    //所有的require依赖根路径都是baseUrl
    baseUrl: './js',
    //路径可以是数组，如果第一个加载成功则结束，否则加载后面的文件
    paths:{
        'xframe' : 'xframe',                // 主框架模块
        'basis': 'basisModule',             // 基础模块
        'string': 'stringModule',           // 字符串方法扩展模块
        'array' : 'arrModule',              // 数组方法扩展模块
        'func' : 'funcModule',              // AOP模块
        'domReady' : 'domReadyModule',      // 异步加载模块
        'dom' : 'domModule',                // DOM元素操作模块
        'css' : 'cssModule',                // CSS样式模块
        'attr' : 'attrModule',              // 属性模块
        'content' : 'contentModule',        // 内容模块
        'event' : 'eventModule',            // 事件模块
        'select' : 'selectModule',          // 选择模块
        'animate' : 'animateModule',        // 动画模块
        'cache' : 'cacheModule'             // 缓存模块
    }
});