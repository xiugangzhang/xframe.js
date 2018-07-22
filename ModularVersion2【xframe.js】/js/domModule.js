/**
 * @Desc : 主要的功能模块展示
 * @Author : xiugang
 * @Time : 20180722
 */
// DOM框架
define(['js/xframe'], function (xframe) {
    var api = {};

    api.isNeedChainedAccess = function () {
        // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)
        xframe.extend({
            /**
             * 向现有的元素集合中添加元素节点（修改this的内容）
             * @param dom
             * @return {add}
             */
            add: function (dom) {
                // 1. 项伪数组中添加元素
                this[this.length] = dom;
                // 2. 数组的长度也需要改变了
                this.length++;
                return this;
            },
            /**
             * 向现有的元素节点中添加dom节点(对使用选择器获取的一系列元素都添加孩子节点child)
             * @param child，这里创建的实际上是一个JQuery对象
             */
            append: function (child) {
                // 这里获取的实际上就是只有一个的
                var doms = typeof child === 'string' ? $(child) : $(child[0]),
                    arr = Array.prototype.slice.call(doms);
                //console.log(typeof doms[0], typeof arr[0]);
                // 2. 调用自己的方法将一个伪数组转换为数组，并开始遍历
                /*for (var i = 0; i < this.length; i++){
                    for (var j = 0; j < doms.length; j++){
                        // 注意这里的操作， 由于在每次添加一个新的元素之后， this的长度就会增加，因此这里在修改之前先把this.length修改一下
                        this[i].appendChild(doms[j]);
                    }
                }*/
                /*this.each(function (element) {
                    arr.forEach(function (childNode) {
                        element.appendChild(childNode);
                    });
                });*/


                // 这里的处理目的是，如果穿过来的DOM节点只是有一个的话需要创建和this长度相同的DOM元素
                if (arr.length !== this.length) {
                    arr = [];
                    // 相当于是把本身复制几份
                    Array.prototype.slice.call(this).each(function () {
                        arr.push(doms[0]);
                    });

                }

                // 开始向父亲节点添加元素
                Array.prototype.slice.call(this).forEach(function (element, index) {
                    element.appendChild(arr[index]);
                });

                // 开始向我获取的this节点里面添加数据
                /*for (var i = 0; i < this.length; i++){
                    for (var j = 0; j < arr.length; j++){
                        if (this[i].childNodes){
                            continue;
                        }
                        // 注意这里的操作， 由于在每次添加一个新的元素之后， this的长度就会增加，因此这里在修改之前先把this.length修改一下
                        this[i].appendChild(arr[j]);
                    }
                }*/

            },
            /**
             * 把选择器中的节点添加到父容器中
             * @param parent
             */
            appendTo: function (parent) {
                // 1. 获取所有的父容器
                var doms = $.isString(parent) ? $(parent) : parent,
                    self = this;
                // 2. 向父容器中添加孩子节点
                Array.prototype.slice.call(this).forEach(function (element, index) {
                    doms[index].appendChild(self[index]);
                });

                return this;
            },
            /**
             * 获取指定下表下面的DOM节点
             * @param num
             * @return {null}
             */
            get: function (num) {
                return this[num] ? this[num] : null;
            },
            /**
             * 获取一个类似于JQuery的对象实例
             * @param num
             * @return {jQuery|HTMLElement}
             */
            eq: function (num) {
                // 1. 获取一个JQuery对象，首先先获取这个DOM元素节点
                var dom = this.get(num);
                // 2. 把这个DOM节点转换为一个JQuery对象
                return $(dom);
            },
            /**
             * 获取第一个JQuery对象
             * @return {*|jQuery|HTMLElement}
             */
            first: function () {
                return this.eq(0);
            },
            /**
             * 获取最后一个JQuery对象
             * @return {*|jQuery|HTMLElement}
             */
            last: function () {
                return this.eq(this.length - 1);
            },
            /**
             * 获取一个DOM节点的所有子节点
             * @return {array}
             */
            children: function () {
                // 获取一个元素的所有的孩子节点
                // 1. 定义一个伪数组， 用于存储所有的孩子节点, 然后获取默认的第一个元素的所有孩子节点
                var children = this[0].children,
                    len = children.length,
                    that = {},
                    i = 0;

                // 初始化定义的这个伪数组
                that.length = len;
                for (; i < len; i++) {
                    that[i] = children[i];
                }

                return that;
            },
            /**
             * 从当前DOM元素节点向下寻找一层元素节点
             * @param str
             * @return {}
             */
            find: function (str) {
                var res = [],
                    self = this,
                    doms;
                this.each(function () {
                    switch (str.charAt(0)) {
                        case '.':
                            // 类选择器
                            doms = $.$class(str.substring(1), self[i]);
                            pushArray(doms);
                            break;
                        default:
                            // 标点选择器
                            doms = $.$tag(str, self[i]);
                            pushArray(doms);
                            break;
                    }
                });

                function pushArray(doms) {
                    if (doms.length) {
                        self.toArray(doms, function () {
                            res.push(this);
                        });
                    }
                }

                // 【注意：】为了能够返回一个JQuery对象，这里需要再次进行处理
                var that = this;
                that.length = this.length;
                this.each(function (index) {
                    // 这里需要再次构造一个伪数组对象，从而实现链式访问的功能
                    that[index] = res[index];
                });

                // 这里在修改that的时候实际上会间接地把this这个变量修改了
                return that;
            },
            /**
             * 获取一个元素的父类节点
             * @return {parent}
             */
            parent: function () {
                // 获取父节点，并且返回一个JQuery对象
                var parent = this[0].parentNode;
                this[0] = parent;
                this.length = 1;

                // 由于每一个元素只会有一个父类节点，因此长度为1
                return this;

            },
            /**
             * 获取一个元素在同一个级别的元素里面的下表编号
             * @return {number}
             */
            index: function () {
                // 获取元素本身在同一个级别下面的元素下表编号
                var srcNode = this[0],
                    children = srcNode.parentNode.children,
                    self = this,
                    defaultRes = -1;

                self.toArray(children, function (index) {
                    // 这里的this指向的就是每一个元素， index指向的就是元素的下表编号
                    if (children[index] === srcNode) {
                        defaultRes = index;
                    }
                });
                // 返回查询到的结果下标
                return defaultRes;
            }
        });
    }


    api.isNotNeedChainedAccess = function () {
        // 不需要参与链式访问的
        xframe.extend(xframe, {
            /**
             * 创建一个DOM元素节点
             * @param type
             * @param value
             * @param html
             * @return {*}
             */
            create: function (type, value, html) {
                var dom = document.createElement(type);
                return xframe().add(dom).attr(value).html(html);
            },
            /**
             * 直接的孩子节点
             * @param dom
             * @param tag
             * @return {jQuery|HTMLElement}
             */
            directChildren: function (dom, tag) {
                var res = [],
                    tag = tag;
                if (typeof dom === 'string') {
                    dom = $(dom);
                }

                // 如果是一个元素集合的处理方法
                if (dom.length) {
                    Array.prototype.slice.call(dom).each(function () {
                        getDOM(this.children);
                    });
                } else {
                    // 如果只是一个元素的处理方法
                    getDOM(dom.children);
                }

                /**
                 * 主要用于把满足已知条件的DOM元素集合统一放入到一个新的res数组里面去
                 * @param doms
                 */
                function getDOM(doms) {
                    Array.prototype.slice.call(doms).each(function () {
                        if (this.tagName.toLowerCase() === tag.toLowerCase()) {
                            res.push(this);
                        }
                    });
                }

                // 如果获得了这个直接子节点，就直接返回这个对象
                return $(res);
            },
        });
    }

    // 由于这里是封装成了函数，因此组需要在这里调用一下
    api.isNeedChainedAccess();
    api.isNotNeedChainedAccess();


    return api;
});