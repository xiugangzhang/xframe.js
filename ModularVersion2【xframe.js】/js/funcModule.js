/**
 * @Desc : 主要的功能模块展示
 * @Author : xiugang
 * @Time : 20180722
 */
// 专门用于处理扩充函数的模块
// AOP模块
define(function () {
    var api = {};


    api.before = function (func) {
        // 一般来说加下划线的变量为私有变量，这是常规都比较遵守的一种代码规范。
        var __self = this;      // 私有的属性用下划线
        return function () {
            // 重新把我需要传递的参数传递过去， 如果目标函数返回的是false, 就是false
            if (func.apply(this, arguments) === false) {
                return false;
            }
            // 否则就把我的自己的参数传递过去
            return __self.apply(this, arguments);
        }
    }


    /**
     * AOP 切面编程的函数扩充
     * @param func
     * @return {Function}
     */
    api.after = function (func) {
        var __self = this;
        return function () {
            var ret = __self.apply(this, arguments);        // //返回一个函数，相当于一个代理函数，也就是说，这里包含了原函数和新函数，原函数指的是myFunc，新函数指的是fn
            if (ret === false) {
                return false;
            }
            func.apply(this, arguments);
            return ret;
        }
    }

    return api;
});