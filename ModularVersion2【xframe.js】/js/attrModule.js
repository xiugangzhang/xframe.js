/**
 * @Desc : 主要的功能模块展示
 * @Author : xiugang
 * @Time : 20180722
 */
// 属性框架的封装
define(['js/xframe'], function (xframe) {
    var api = {};
    api.isNeedChainedAccess = function () {
        // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)
        xframe.extend({
            /**
             * 获取/设置某一个元素的属性信息
             * @return {*}
             */
            attr: function () {
                // 获取属性信息：两种格式，1. 取值模式 2.设置模式
                var args = arguments;
                if (args.length === 0) {
                    // 没有参数的话，就直接返回本身
                    return this;
                } else if (args.length === 1) {
                    // 一个参数的话需要进行判断
                    if (typeof args[0] === 'string') {
                        // 取值模式
                        return this[0].getAttribute(args[0]);
                    } else if (typeof args[0] === 'object') {
                        // json对象的话也算是一个设置模式
                        for (var item in args[0]) {
                            Array.prototype.slice.call(this).each(function () {
                                this.setAttribute(item, args[0][item]);
                            });
                        }
                    }
                } else if (args.length === 2) {
                    Array.prototype.slice.call(this).each(function () {
                        this.setAttribute(args[0], args[1]);
                    });
                }

                // 注意这里的this实际上返回的是一个xframe实例对象，但是xframe.eatend(xframe, {})这里的this实际上是一个xframe(selector, context)函数， 还没有实例化呢
                return this;
            },
            /**
             * 判断DOM元素节点是不是拥有某一个属性
             * @param val
             * @return {boolean}
             */
            hasClass: function (val) {
                if (!this[0]) {
                    return false;
                }
                // 默认只会获取第一个元素的相关信息
                return this[0].className === val.trim() ? true : false;
            },
            /**
             * 添加一个class class='xiugang 18 nan'
             * @param val
             */
            addClass: function (val) {
                // 处理传进来的字符串两边的空格
                val = val.trim();
                [].slice.call(this).each(function () {
                    // 只要原来的DOM节点上面没有这个属性的话，就直接添加上去
                    if (val !== this.className) {
                        this.className += ' ' + val;
                    }
                })
                return this;
            },
            /**
             * 注意熟练掌握replace（）函数的使用
             * @param val
             */
            removeClass: function (val) {
                val = val.trim();
                [].slice.call(this).each(function () {
                    if (val === this.className) {
                        // 使用后面替换前面的
                        this.className = this.className.replace(val, '');
                    }
                })
                return this;
            },
            /**
             * 如果有的话就直接删除，没有的话就添加一个
             * @param val
             * @return {toggleClass}
             */
            toggleClass: function (val) {
                val = val.trim();
                [].slice.call(this).each(function () {
                    if (val === this.className) {
                        // 如果有的话就直接删除
                        this.className.replace(val, '');
                    } else {
                        // 没有的话就添加一个
                        this.className += ' ' + val;
                    }
                });
                return this;
            }
        });
    }
    api.isNotNeedChainedAccess = function () {
        // 不需要参与链式访问的
        xframe.extend(xframe, {});
    }

    api.isNotNeedChainedAccess();
    api.isNeedChainedAccess();
    return api;
});