/**
 * @Desc : 主要的功能模块展示
 * @Author : xiugang
 * @Time : 20180722
 */
// 这是一个选择框架
define(['js/xframe'], function (xframe) {
    var api = {};

    api.isNeedChainedAccess = function () {
        // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)
        xframe.extend({

        });
    }
    api.isNotNeedChainedAccess = function () {
        // 不需要参与链式访问的
        xframe.extend(xframe, {
            /**
             * ID选择器
             * @param context
             * @return {HTMLElement | *}
             */
            $id: function (context) {
                // context是一个DOM对象还是字符串
                context = $.isString(context) ? document.getElementById(context) : context;
                return context;
            },
            /**
             * tag选择器， context；里面存储了上下文信息（尽量少的使用局部变量）
             * @param tag
             * @param context
             * @return {NodeListOf<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>}
             */
            $tag: function (tag, context) {
                // 分为两种情况
                if (typeof context === 'string') {
                    context = this.$id(context);
                }

                // 按照这种思路，只有可能是一种情况
                if (context) {
                    if (context.length) {
                        // 这里默认只会返回数组中的第0个元素
                        return [].slice.call(context)[0].getElementsByTagName(tag);
                    } else {
                        return context.getElementsByTagName(tag);
                    }
                }
                return document.getElementsByTagName(tag);
            },
            /**
             * 实现一个类选择器
             * @param className
             * @param context
             * @return {*}
             */
            $class: function (className, context) {
                // context里面此时存储的是一个DOM节点元素
                // 如果直接传过来的是一个DOM元素节点context(DOM元素的话就单独处理)
                context = this.$id(context) || document;

                // 1.由于getElementByClassName()这个方法是不兼容的，因此需要使用浏览器内置的方法去获取类选择器
                // 2. 可以使用getElementByTagName（）的方法去获取所有的标签元素，然后把再使用className的属性间接去实现一个类似的class选择器的功能
                if (context.getElementsByClassName) {
                    // 如果支持这个方法的话
                    return context.getElementsByClassName(className);
                } else {
                    // 不支持的话就间接获取
                    var doms = context.getElementsByTagName('*'),
                        res = [];
                    // 使用自己定义的方法去实现一个类选择器
                    doms.each(function () {
                        if (this.className === className) {
                            // 只要是找到了这个class的集合，就放入到一个数组里面
                            res.push(this);
                        }
                    });
                    return res;

                }
            },
            /**
             * 使用管道思想实现一个层次选择器
             * @return {Array}
             */
            $cengci: function () {
                var self = this;
                // 主要功能：实现一个层次选择器
                // 输入字符串： str = '#className div  a p'  选择所有的className 下面的P标签
                // 1. 获取穿过来的参数(数组元素去重)
                var args = Array.prototype.slice.call(arguments)[0].toString().split(' '),
                    index,
                    first,
                    item,
                    selector,
                    res = [],           // 存储了本次的结果信息
                    context = [];            // 存储了上一次的上下文信息【管道思想!】, context = 'tag .class #id'


                // 思考： 为了实现一个层次选择器， 如何实现一个吧上一次选择的元素全部存储起来??？


                // 2. 开始解析参数信息
                args.each(function () {
                    // 每次重复之前，先把本次需要存储的数组清空(res里面存储了每次的最新数据)
                    res = [];

                    // 对获取到的每一项进行处理
                    item = this.trim();
                    first = item.charAt(0);
                    index = item.indexOf(first);
                    selector = item.slice(index + 1);


                    // 使用管道思想实现一个层次选择器！！！
                    switch (first) {
                        case '.':  // class 选择器
                            if (context.length) {
                                // 说明这一次的class类选择器中的元素不是第一次出现
                                context.each(function () {
                                    pushArray(self.$class(selector, this));
                                });
                            } else {
                                // 如果是第一次出现的话
                                pushArray(self.$class(selector));
                            }
                            // 把上一次执行的结果存起来
                            context = res;
                            break;
                        case '#':  // ID选择器
                            // 由于ID选择器获取的元素始终是唯一的，因此直接放进去即可
                            res.push(self.$id(selector));
                            // 把上一次执行的结果存起来
                            context = res;
                            break;
                        default:    // tag选择器
                            if (context.length) {
                                // 说明不是第一次出现
                                context.each(function () {
                                    // 注意在使用tag选择器的时候，第二个参数必须是一个ID选择器，或者是一个
                                    // 1. 注意在放入数组的时候，需要逐个遍历然后放进去
                                    pushArray(self.$tag(item, this));
                                });
                            } else {
                                // 第一次出现的
                                pushArray(self.$tag(item));
                            }
                            // 把上一次执行的结果存起来
                            context = res;
                            break;
                    }
                });


                /**
                 * 把公共的部分代码封装起来
                 * @param doms
                 */
                function pushArray(doms) {
                    if (doms) {
                        [].slice.call(doms).each(function () {
                            res.push(this);
                        });
                    }
                }

                return context;
            },
            /**
             * group选择器
             * @return {Array}
             */
            $group: function () {
                var self = this;
                // '.moshou,#moshou,span,.dream'
                // 1. 获取传过来的参数
                var args = [].slice.call(arguments),
                    arr = args[0].split(',').unique(),      // 这里在拿到这个分割后的字符串后，开始进行数组元素去重
                    item,
                    index,
                    first,
                    selector;
                res = [];

                // 2. 开始遍历参数集合，解析参数信息
                arr.each(function () {
                    // 3. 开始遍历得到结果,获取每一项
                    item = this.trim();
                    // 4. 开始获取首字母信息，和后面的选择器信息
                    // 4. 获取指定下标位置对应的字符
                    first = item.charAt(0);
                    index = item.indexOf(first);
                    selector = item.slice(index + 1);


                    // 开始根据第一个字母向下进行判断，把满足相应条件的放在数组里面
                    switch (first) {
                        case '.':
                            // class选择器
                            res.push(self.$class(selector));
                            break;
                        case '#':
                            // ID 选择器
                            res.push(self.$id(selector));
                            break;
                        default:
                            // TAG选择器(直接就是first本身，这里不用再判断了使用selector这个变量了)
                            res.push(self.$tag(item));
                            break;
                    }
                });

                return res;
            },
            /**
             * 多组+层次选择器
             * @return {Array}
             */
            $select: function () {
                // str = '#tag , .calss'
                var args = [].slice.call(arguments)[0].toString().split(','),
                    ret = [],
                    self = this;

                // 遍历args数组，对数组的每一项采用层次选择器
                args.each(function () {
                    // 1. 对于逗号分隔的部分采用层次选择,获取层次选择器的结果信息， 是一个数组集合
                    var res = self.$cengci(this);
                    // 2. 遍历层次选择器的集合，把信息放入到一个新的数组里面， 就是得到的多组选择器的结果信息
                    pushArray(res);
                });


                // 层次选择器
                function pushArray(doms) {
                    if (doms.length) {
                        doms.each(function () {
                            ret.push(this);
                        });
                    }
                }

                return ret;
            }
        });
    }

    // 由于这里是封装成了函数，因此组需要在这里调用一下
    api.isNeedChainedAccess();
    api.isNotNeedChainedAccess();


    return api;
});