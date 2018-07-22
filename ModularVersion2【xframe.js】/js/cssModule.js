/**
 * @Desc : 主要的功能模块展示
 * @Author : xiugang
 * @Time : 20180722
 */
// CSS样式框架
define(['js/xframe'], function (xframe) {
    var api = {};

    api.isNeedChainedAccess = function(){
        // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)【只要是需要使用到this获取到的元素集合这个变量的时候，这里就是需要进行链式访问的】
        xframe.extend({
            /**
             * 给DOM元素设置/取值CSS样式
             * @return {*}
             */
            css: function () {
                // 分为两种情况，一种是取值模式，一种是设置模式
                var arg = arguments,
                    len = arg.length,
                    j = this.length - 1;
                if (len === 0) {
                    // 没有参数的话，就直接返回这个DOM集合
                    return this;
                } else if (len === 1) {
                    // 取值模式
                    if (typeof arg[0] === 'string') {
                        if (this[0].currentStyle) {
                            // w3c
                            return this[0].currentStyle[arg[0]];
                        } else {
                            // 其他IE
                            return getComputedStyle(this[0], false)[arg[0]];
                        }
                    } else if (typeof arg[0] === 'object') {
                        // 如果要获取一系列对象的属性信息, 如果传过来的一个参数是一个json对象的话，这里也采用这种方式
                        // {name : xiugang, age : 18}
                        for (var item in arg[0]) {
                            // 从后向前开始遍历，设置模式
                            for (; j >= 0; j--) {
                                // 由于CSS在设置值的时候的取值模式和设置模式的不同，这里需要先使用驼峰表示法进行处理一下
                                // 先把item转换为：backgroundcolor --> backgroundColor
                                item = item.camelize();
                                this[j].style[item] = arg[0][item];
                            }
                        }
                    }
                } else if (len === 2) {
                    // 设置模式
                    for (; j >= 0; j--) {
                        // 第一个参数是我们需要设置的值(这里使用的是驼峰表示法)
                        // 转换background-color ---> backgroundColor
                        this[j].style[arg[0].camelize()] = arg[1];
                    }
                }
                return this;
            },
            /**
             * 隐藏一个元素
             * @return {hide}
             */
            hide: function () {
                var j = this.length - 1;
                for (; j >= 0; j--) {
                    this[j].style.display = 'none';
                }
                return this;


                // 方法二：使用之前封装好的框架进行遍历
                this.each(function () {
                    this.style.display = 'none';
                })
            },
            /**
             * 显示元素
             * @return {show}
             */
            show: function () {
                this.each(function () {
                    this.style.display = 'block';
                })
                return this;
            },
            /**
             * 获取元素的宽度
             * @return {*}
             */
            width: function () {
                return this[0].clientWidth;
            },
            /**
             * 获取元素的高度
             * @return {*}
             */
            height: function () {
                return this[0].clientHeight;
            },
            /**
             * //当元素出现滚动条时候，这里的高度有两种：可视区域的高度 实际高度（可视高度+不可见的高度）
             * 获取元素的滚动宽度
             * @return {*}
             */
            scrollWidth: function () {
                return this[0].scrollWidth;
            },
            /**
             * 获取元素的滚动高度
             * @return {*}
             */
            scrollHeight: function () {
                return this[0].scrollHeight;
            },
            /**
             * 元素滚动的时候 如果出现滚动条 相对于左上角的偏移量
             * @return {*}
             */
            scrollTop: function () {
                return this[0].scrollTop;
            },
            /**
             * 元素滚动的时候相对于左上角的距离
             * @return {*}
             */
            scrollLeft: function () {
                return this[0].scrollLeft;

            },
        });
    }


    api.isNotNeedChainedAccess = function(){
        // 不需要参与链式访问的
        xframe.extend(xframe, {
            getThis: function () {
                console.log(xframe, typeof this);  // function, 这里的this指向的实际上是一个函数function (selector, context)
            },

            /**
             * 获取屏幕的高度
             * @return {number}
             */
            screenHeight: function () {
                return window.screen.height;
            },
            /**
             * 虎丘屏幕的款U盾
             * @return {number}
             */
            screenWidth: function () {
                return window.screen.width;
            },
            /**
             * 获取浏览器窗口文档显示区域的宽度，不包括滚动条
             * @return {number}
             */
            wWidth: function () {
                return document.documentElement.clientWidth;
            },
            /**
             * 获取浏览器窗口文档显示区域的高度，不包括滚动条
             * @return {number}
             */
            wHeight: function () {
                return document.documentElement.clientHeight;
            },

            /**
             * 文档滚动区域的整体的高
             * @return {number}
             */
            wScrollHeight: function () {
                return document.body.scrollHeight;
            },
            /**
             * 文档滚动区域的整体的宽度
             * @return {number}
             */
            wScrollWidth: function () {
                return document.body.scrollWidth;
            },
            /**
             *  获取滚动条相对于其顶部的偏移
             *  @return {number}
             */
            wScrollTop: function () {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                return scrollTop;
            },
            /**
             * 获取整个文档窗口的距离整个窗口的宽度和高度（滚动条相对于顶部和左边的距离）
             * @return {number}
             */
            wScrollLeft: function () {
                var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
                return scrollLeft;
            }
        });
    }


    // 由于这里是封装成了函数，因此组需要在这里调用一下
    api.isNeedChainedAccess();
    api.isNotNeedChainedAccess();

    return api;
});