/**
 * @Desc : 主要的功能模块展示
 * @Author : xiugang
 * @Time : 20180722
 */
/**
 * 定义一个基础框架,这里的模块名字必须和文件的名字一样
 */
define(['js/xframe'], function (xframe) {
        // 数据类型检验模块
    var api = {};
    // 鸭子类型（duck typing）如果它走起路来像鸭子，叫起来也是鸭子，那么它就是鸭子。
    // 只关注对象的行为，不关注对象本身面向接口编型 ，而不是面向实现编程，是设计模式中最重要的思想。
    // 【理解】：一个对象有效的语义，不是由集成自特定的类或实现特定的接口， 而是由当前方法和属性的集合决定的!!!
    api.isNeedChainedAccess = function(){

    }
    api.isNotNeedChainedAccess = function(){
        /*数据类型检验*/
        xframe.extend(xframe, {
            // 鸭子类型（duck typing）如果它走起路来像鸭子，叫起来也是鸭子，那么它就是鸭子。
            // 只关注对象的行为，不关注对象本身面向接口编型 ，而不是面向实现编程，是设计模式中最重要的思想。
            // 【理解】：一个对象有效的语义，不是由集成自特定的类或实现特定的接口， 而是由当前方法和属性的集合决定的!!!
            isNumber: function (val) {
                // 如果这个数字是有限的话， 而且是数字类型
                return (typeof val === 'number' && isFinite(val)) && (Object.prototype.toString.call(val) === '[object Number]');
            },
            /***
             * 判断一个变量是不是Boolean类型
             * @param val
             * @returns {boolean}
             */
            isBoolean: function (val) {
                return (typeof val === 'boolean') && (Object.prototype.toString.call(val) === '[object Boolean]');
            },
            /**
             * 判断一个变量是不是字符串类型
             * @param val
             * @returns {boolean}
             */
            isString: function (val) {
                return (typeof val === 'string') && (Object.prototype.toString.call(val) === '[object String]');
            },
            /**
             * 判断一个变量是不是undefined
             * @param val
             * @returns {boolean}
             */
            isUndefined: function (val) {
                // oid 0 is a correct and standard way to produce undefined.
                return (val === void 0) || (typeof val === 'undefined') && (Object.prototype.toString.call(val) === '[object Undefined]');
            },
            /**
             * 判断一个变量是不是为空
             * @param val
             * @returns {boolean}
             */
            isNull: function (val) {
                return (val === null) && (Object.prototype.toString.call(val) === '[object Null]');
            },
            /**
             * 检测
             * @param obj
             * @returns {*}
             */
            isNaN: function (val) {
                // 只要这个数字通过判断是不是和他自身相同或者使用typef的方式去检测
                return val !== val;
            },
            /**
             * 判断一个变量是不是一个对象类型
             * @param val
             * @returns {boolean}
             */
            isObject: function (val) {
                if (val !== null && val !== undefined) {
                    if ((typeof val === 'object') && (Object.prototype.toString.call(val))) {
                        return true;
                    }
                }
                return false;
            },
            /**
             * 判断一个对象是不是数组对象
             * @param val
             * @returns {boolean|void|string}
             */
            isArray: function (val) {
                // 判断上不是一个数组的先判断这个数组对象是不是为空， 因为如果val为空的话，就是val.constructor这个属性实际上是没有的，error
                if (val !== null || typeof val !== "undefined") {
                    // 注意在使用constructor判断数据类型的时候比较的实际上是他的原型对象的constructor属性， 这个属性指向的实际上是这个变量的原型对象
                    return (val.constructor === Array) && (Object.prototype.toString.call(val) === '[object Array]');
                }
                return false;
            }

        });
    }


    //  调用函数，实现生效
    api.isNeedChainedAccess();
    api.isNotNeedChainedAccess();

    return api;
});