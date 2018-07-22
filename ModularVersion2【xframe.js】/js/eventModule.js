/**
 * @Desc : 主要的功能模块展示
 * @Author : xiugang
 * @Time : 20180722
 */
/**
 * 实现我的事件框架，这个框架是依赖于我的xframe框架的
 */
define(['js/xframe'], function (xframe) {
    var api = {};

    api.isNeedChainedAccess = function(){
        // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)
        xframe.extend({
            /**
             * 实现一个浏览器的基本事件的绑定
             * @param type
             * @param fn
             * @return {on}
             */
            on: function (type, fn) {
                // 注意这里的初始的下标编号是长度减一
                var i = this.length - 1;
                // 可以实现兼容版本的IE浏览器和W3c浏览器的支持
                if (document.addEventListener) {
                    // w3c(这里使用的方式是从后向前遍历， 使得每一个DOM加载完毕之后再去添加事件)
                    for (; i >= 0; i--) {
                        this[i].addEventListener(type, fn, false);
                    }
                } else if (document.attachEvent) {
                    // IE
                    for (; i >= 0; i--) {
                        this[i].attachEvent('on' + type, fn);
                    }
                } else {
                    // 其他的浏览器
                    for (; i >= 0; i--) {
                        // 获取json数据的两种方式，绑定事件的方式也可以
                        this[i]['on' + type] = fn;
                    }
                }
                return this;
            },
            /**
             * 实现事件的解除绑定
             * @param type
             * @param fn
             * @return {un}
             */
            un: function (type, fn) {
                // 注意这里的初始下标编号
                var i = this.length - 1;
                if (document.removeEventListener) {
                    // W3c
                    for (; i >= 0; i--) {
                        this[i].removeEventListener(type, fn, false);
                    }
                } else if (document.detachEvent) {
                    // IE浏览器
                    for (; i >= 0; i--) {
                        this[i].detachEvent(type, fn);
                    }
                } else {
                    // 其他浏览器的话，就直接默认绑定的所有事件置为null
                    for (; i >= 0; i--) {
                        // 移出所有绑定的事件
                        this[i]['on' + type] = null;
                    }
                }
                return this;

            },
            /**
             * 实现单个元素的事件绑定
             * @param fn
             * @return {click}
             */
            click: function (fn) {
                this.on('click', fn);
                return this;

            },
            /**
             * 实现鼠标移动进来和出去的事件响应（鼠标悬浮事件）
             * @param fnOver
             * @param fnOut
             * @return {hover}
             */
            hover: function (fnOver, fnOut) {
                var i = this.length;
                // 还是采用的是从后向前遍历的方式
                for (; i >= 0; i--) {
                    if (fnOver && typeof fnOver === 'function') {
                        this.on('mouseover', fnOver);
                    }
                    if (fnOut && typeof  fnOut === 'function') {
                        this.on('mouseout', fnOut);
                    }
                }
                return this;
            },
            /**
             * 如果被选元素可见，则隐藏这些元素，如果被选元素隐藏，则显示这些元素。
             * toggle方法,切换,接收任意个参数,不断在参数间循环.例:点击显示隐藏
             * @return {toggle}
             */
            toggle: function () {
                // 实现一个事件的切换f1, f2
                var self = this,
                    _arguments = arguments,
                    i = 0,
                    len = this.length;


                // 把所有的事件响应函数存起来
                for (; i < len; i++) {
                    addToToggle(this[i]);
                }


                /**
                 * 鼠标点击之后逐个调用自己绑定的事件
                 * @param obj
                 */
                function addToToggle(obj) {
                    // 定义一个私有的计数器
                    var count = 0;
                    // 添加事件
                    self.on('click', function () {
                        // 使用call去修改this的指向(这里的主要作用是去切换，轮巡切换状态)
                        _arguments[count++ % _arguments.length].call(obj);
                    });
                }

                return this;
            }
        });
    }

    api.isNotNeedChainedAccess = function(){
        // 不需要参与链式访问的
        xframe.extend(xframe, {
            /**
             * 获取事件对象
             * @param event
             * @return {Event}
             */
            getEvent: function (event) {
                return event ? event : window.event;
            },
            /**
             * 获取触发事件的元素
             * @param event
             * @return {*|Element|Object}
             */
            getTarget: function (event) {
                var event = this.getEvent(event);
                return event.target || event.srcElement;
            },
            /**
             * 阻止事件冒泡
             * @param event
             */
            stopPropagation: function (event) {
                var event = this.getEvent(event);
                if (event.stopPropagation) {
                    // W3c
                    event.stopPropagation();
                } else {
                    // IE
                    event.cancelBubble = true;
                }
            },
            /**
             * 阻止默认的行为
             * @param event
             */
            preventDefault: function (event) {
                var event = this.getEvent(event);
                if (event.preventDefault) {
                    // w3c
                    event.preventDefault();
                } else {
                    // IE
                    event.returnValue = false;
                }
            },
            /**
             * 获取鼠标滚轮的运动的详细信息
             * @param event
             * @return {*}
             */
            getDelta: function (event) {
                var event = this.getEvent(event);
                if (event.wheelDelta) {
                    // w3c
                    return event.wheelDelta;
                } else {
                    // ie
                    // Firefox的值有所不同，因此首先要将这个值的符号反向，然后再乘以40，就可以保证与其它浏览器的值相同了
                    return -event.detail * 40;
                }
            }
        });
    }

    // 由于这里是封装成了函数，因此组需要在这里调用一下
    api.isNeedChainedAccess();
    api.isNotNeedChainedAccess();


    return api;
});