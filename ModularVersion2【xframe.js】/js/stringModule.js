/**
 * @Desc : 主要的功能模块展示
 * @Author : xiugang
 * @Time : 20180722
 */
/**
 *  这个模块是用来出来原型对象的方法扩展的，主要用于实现一个String，Array，Function等内置函数方法的扩展
 */
define(function () {

    // 定义一个关于字符串处理的API接口
    var api = {
    }


    api.isNeedChainedAccess = function(){

    }
    api.isNotNeedChainedAccess = function(){
        // str = 'name: @(name), age:@(age)'
        // data = {name : 'xiugang', age : 18}
        /**
         * 实现一个简单的数据绑定
         * @param str
         * @param data
         * @return {*}
         */
        String.prototype.formateString = function (data) {
            return this.replace(/@\((\w+)\)/g, function (match, key) {
                // 注意这里找到的值必须返回出去(如果是undefined，就是没有数据)
                // 注意：判断一个值的类型是不是undefined，可以通过typeof判断
                console.log(typeof data[key] === 'undefined');
                return data[key] === 'undefined' ? '' : data[key];
            });

        }
        /**
         * 去掉坐标的空格
         * @param str
         * @return {*}
         */
        String.prototype.ltrim = function () {
            return this.replace(/^\s*/g, '');

        }
        /**
         * 去掉右边的空格
         * @param str
         * @return {*}
         */
        String.prototype.rtrim = function () {
            return this.replace(/\s*$/g, '');
        }
        /**
         * 去掉两边的空格
         * @param str
         * @return {*}
         */
        String.prototype.trim = function () {
            return this.replace(/(^\s*)|(\s*$)/g, '');
        }

        // red===>Red
        /**
         * 将第一个字母小写，其他字母大写
         * @param str
         * @return {*}
         */
        String.prototype.camelCase = function () {
            // .*?是非贪婪的匹配，点可以匹配任意字符，星号是前边的字符有0-n个均匹配，问号是则是0-1；
            // (^\w{1}): 用于匹配第一个首字母
            // (.*)：用于匹配任意个的前面的字符

            // - param 1: 匹配到的字符串
            // - param 2: 匹配的的子字符串
            // - param 3: 匹配的子字符串
            // - param 4: 匹配到的字符串在字符串中的位置
            // - param 5: 原始字符串

            return this.replace(/(^\w{1})(.*)/g, function (match, g1, g2) {
                return g1.toUpperCase() + g2.toLowerCase();
            });
        }
        /**
         * @param 作用是将连字符类的css属性值，转换成驼峰写法。
         * 将background-color转换为backgroundColor
         */
        String.prototype.camelize = function(){
            //  \w 表示 匹配包括下划线的任何单词字符
            return this.replace(/-(\w)/g, function (strMatch, p1){
                return p1.toUpperCase();
            });
        }

        /**
         * 将一个字符串的下划线转换为中划线
         * @param str
         * @return {*}
         */
        String.prototype.dashString = function () {
            // 这里面的this实际上指向的就是我们自己定义的一个变量字符串
            return this.replace(/\_/g, '-');
        }

        /**
         * 检测一个字符串是不是为空
         * @return {boolean}
         */
        String.prototype.isEmpty = function () {
            return this.length === 0;

        }
        /**
         * 判断字符串是不是包含一个字符串
         * @param target
         * @return {boolean}
         */
        String.prototype.contains = function (target) {
            // 只要这个indexOf的下标不是-1的话，就说明包含这个目标字符串，否则的话就是不包含
            // indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置，如果没找到的话，就返回-1
            return this.indexOf(target) !== -1;
        }
        /**
         * 对一个字符串中的特殊字符进行转义
         * @return {string}
         */
        String.prototype.escapeHTML = function () {
            /*显示结果	描述	实体名称	实体编号
                        空格	&nbsp;	&#160;
                        <	小于号	&lt;	&#60;
                        >	大于号	&gt;	&#62;
                        &	和号	&amp;	&#38;
                        "	引号	&quot;	&#34;
                        '	撇号 	&apos; (IE不支持)	&#39;
                        ￠	分	&cent;	&#162;
                        �0�5	镑	&pound;	&#163;
                        �0�6	日圆	&yen;	&#165;
                        €	欧元	&euro
            * **/


            // 先进行字符串分割， 得到一个数组
            var strArr = this.split('');
            for (var pos = 0, l = strArr.length, tmp; pos < l; pos++) {
                // 拿到数组中的每一个元素
                tmp = strArr[pos];
                // 对字符串中的每一个元素进行判断， 如果是特殊字符的话就进行处理
                switch (tmp) {
                    // pos始终为1， 表示要替换的项是1项
                    case '<':
                        replaceArr(strArr, pos, '&lt;');
                        break;
                    case '>':
                        replaceArr(strArr, pos, '&gt;');
                        break;
                    case '\'':
                        replaceArr(strArr, pos, '&#39;');
                        break;
                    case '\"':
                        replaceArr(strArr, pos, '&quot;');
                        break;
                    case '&':
                        replaceArr(strArr, pos, '&amp;');
                        break;
                    default:
                        ;
                }
            }
            // join() 方法用于把数组中的所有元素放入一个字符串。
            return strArr.join('');

            // 专门用于替换掉数组中的元素
            /**
             * 替换数组中指定的项
             * @param arr
             * @param pos
             * @param item
             * @return {*}
             */
            function replaceArr(arr, pos, item) {
                // Splice： splice主要用来对JS中的数组进行操作，包括删除，添加，替换等，原来的数组会被改变
                // 删除数据：array.splice(index,num)，返回值为删除内容，array为结果值。index为起始项，num为删除元素的的个数。
                // 插入数据：array.splice(index,0,insertValue)，index要插入的位置，insertValue要插入的项
                // 替换数据：array.splice(index,num,insertValue)，index起始位置，num要被替换的项数，insertValue要替换的值
                return arr.splice(pos, 1, item);
            }

        }
        /**
         * 忽略HTML中的一些内置的特殊字符
         * @return {string}
         */
        String.prototype.escapeHTML = function () {
            return Array.prototype.slice.call(this).join('').replace(/$/g, '&amp')
                .replace(/\</g, '&lt')
                .replace(/\>/g, '&gt')
                .replace(/\'/g, '&#39')
                .replace(/\"/g, '&quot');
        }
        /**
         * 对字符串进行反转义
         * @return {string}
         */
        String.prototype.unescapeHTML = function () {
            // 由于这里的this实际上拿到的是一个字符串数组, 因此第一步需要先把字符串数组转换为一个字符串
            console.log(typeof this);
            // 1.先把这个伪数组转换为数组对象
            var arr = Array.prototype.slice.call(this);
            // 2.把数组中的内容转换为字符串
            var res = arr.join('');
            // 查找所有的< > & " ' 字符，并替换掉
            return res.replace(/&lt/g, '<')
                .replace(/&gt/g, '>')
                .replace(/&#39/g, '\'')
                .replace(/&quot/g, '\"')
                .replace(/&amp/g, '')

                // String.fromCharCode() 静态方法根据指定的 Unicode 编码中的序号值来返回一个字符串。String.fromCharCode(65,66,67) “ABC”
                .replace(/&#(\d+)/g, function ($0, $1) {
                    //parseInt() 函数将给定的字符串以指定基数（radix/base）解析成为整数。就是 你想把string当成radix进制数解析成10进制
                    return String.fromCharCode(parseInt($1, 10));
                });
        }
        /**
         * 把一个字符串进行反转操作
         * @return {string}
         */
        String.prototype.reverse = function () {
            // 1. 先获得我需要的字符串，然后进行分割处理
            var arr = this.toString().split('');
            // 2. 对我分割后得到的数组元素进行逆序处理
            arr = arr.reverse();
            // 3.把数组中的元素变为一个字符串
            return arr.join();
            //return (this.toString()).split('').reverse().join();
        }
    }



    // 调用函数
    api.isNotNeedChainedAccess();
    api.isNeedChainedAccess();


    // 返回这个API接口
    return api;
});