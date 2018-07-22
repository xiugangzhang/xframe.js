/**
 * @Desc : 主要的功能模块展示
 * @Author : xiugang
 * @Time : 20180722
 */
// DOMready
define(function () {
    var api = {};

    api.onReady = function (fn) {
        /**
         * 实现一个domReady方法：所有元素都加载完毕之后一个回调函数
         * @param domElement
         * @param fn
         */
        if (document.addEventListener) {
            fn.call(this, 'status : ok');
            // W3C组织: 如果传过来的是一个DOM元素的话，就直接对这个DOM元素添加监听， 否则，就对整个document添加事件监听
            document.addEventListener('DOMContentLoaded', function () {
                fn.call(this, 'load finished');
            }, false);

        } else {
            // IE浏览器
            IEContentLoaded(fn);
        }


        /**
         * 微软的IE浏览器的处理方法
         * @param fn
         * @constructor
         */
        function IEContentLoaded(fn) {
            // 定义需要的全局变量
            var done = false, document = window.document;


            // 这个函数只会在所有的DOM节点树创建完毕的时候才会继续向下执行
            var init = (function () {
                if (!done) {
                    console.log('done……');
                    // 如果DOM树创建完毕的话
                    done = true;
                    fn();
                }
            })();


            /*
            使用这个立即函数来调用IE浏览器的内置函数实现domReady的功能
             */
            (function () {
                try {
                    // DOM树在未创建完毕之后调用 doScroll的话，会抛出错误
                    document.documentElement.doScroll('left');

                } catch (err) {
                    // 延迟1秒之后再次执行这个函数， 形成一个函数递归调用的功能【回调函数】
                    // clllee是一个函数指针，指向的是拥有这个arguments对象的函数， 从而实现再次调用这个函数
                    setTimeout(arguments.callee, 1);
                    return;
                }

                // 如果没有错误的话，表示DOM树已经完全创建完毕， 此时开始执行用户的回调函数
                init();
            })();

            // 监听document的加载状态(DOM加载的过程中会不断回调这个函数)
            document.onreadystatechange = function () {
                console.log('onreadystatechange……');
                if (document.readyState === 'complete') {
                    console.log('complete……');
                    // 如果加载完成的话
                    document.onreadystatechange = null;
                    init();
                }
            }
        }

    }

    return api;
});