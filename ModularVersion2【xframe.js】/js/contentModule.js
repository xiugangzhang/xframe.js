/**
 * @Desc : 主要的功能模块展示
 * @Author : xiugang
 * @Time : 20180722
 */
// 内容框架
define(function () {
    var api = {};
    api.isNeedChainedAccess = function () {
        // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)
        xframe.extend({
            /**
             * .html()用为读取和修改元素的HTML标签    对应js中的innerHTML
             * @return {html}
             */
            html: function () {
                var arg = arguments,
                    len = arg.length,
                    arr = Array.prototype.slice.call(this);
                if (this.length < 1) {
                    return this;
                }

                // 分为取值模式和设置模式
                if (len === 0) {
                    // 取值模式
                    return this[0].innerHTML;
                } else if (len === 1) {
                    // 设置模式
                    arr.each(function () {
                        this.innerHTML = arg[0];
                    });
                }

                return this;

            },
            /**
             * 用于获取文本信息
             * @return {*}
             */
            text: function () {
                var args = arguments,
                    len = args.length;

                if (this.length === 0) {
                    return this;
                }

                if (len === 0) {
                    // 取值模式
                    return this[0].innerText;
                } else if (len === 1) {
                    // 设置模式
                    this.each(function () {
                        this.innerText = args[0];
                    });

                }
                return this;
            },
            /**
             * 用于获取表单中的数值(input, form)
             * @return {*}
             */
            val: function () {
                // val();设置或者获取表单字段的值（前提是表单设置了value属性）；
                var args = arguments,
                    len = args.length;

                if (this.length === 0) {
                    return this;
                }

                if (len === 0) {
                    return this[0].value;
                } else if (len === 1) {
                    this.each(function () {
                        this.value = args[0];
                    });
                }

                return this;
            }
        });
    }
    api.isNotNeedChainedAccess = function () {
        // 不需要参与链式访问的
        xframe.extend(xframe, {});
    }

    // 由于这里是封装成了函数，因此组需要在这里调用一下
    api.isNeedChainedAccess();
    api.isNotNeedChainedAccess();

    return api;
});