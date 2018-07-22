/**
 * 自定义一个基本的模块：类似于JQuery的基础模块，主要用于实现一个链式访问的功能
 */
define(function () {
    // 返回的必须是一个对象
    // 主框架: 只做一件事，就是用于获取所有的元素集合

    // 定义一个Xframe对象，后面就是他的构造函数
    var xframe = function (selector, context) {
        // 为了使得后面的函数this始终指向的是xframe框架，这里需要修改函数内部this的指向
        return this.init.apply(this, [selector, context]);
    };

    // 定义一个初始化函数，用于初始化获取所有的元素集合
    // 只要用户使用了类似于JQuery中的选择元素的方法，就开始选择一个元素集合
    // 这里的核心功能：实际上是为了使用一个伪数组实现一个类似于JQuery中的链式访问的功能
    xframe.prototype.init = function (selector, context) {
        // 开始构建一个伪数组：{1 : list[0], 2 : list[1], , , , length : list.length}
        this.length = 0;

        // 针对没有参数的处理方式
        if (typeof selector === 'undefined') {
            return this;
        }

        if (typeof  selector === 'string') {
            var nodeList = (context || document).querySelectorAll(selector);
            this.length = nodeList.length;
            for (var i = 0, len = this.length; i < len; i++) {
                this[i] = nodeList[i];
            }
        } else if (selector.nodeType) {
            // 如果获取的是一个元素节点，文本节点，或者属性节点的话
            this[0] = selector;
            this.length++;
        }

        // 为了可以支持链式访问必须把这个this对象返回出去
        return this;
    };


    // 使用双对象法则继续暴露出去一个对象，进行对象的二次封装
    // 【双对象法则的使用】
    var $$ = function (selector, context) {
        var self = this;
        // 这里使用一个简单的异步加载机制，等待所有的DOM元素执行完毕之后再开始继续向下执行
        if (typeof selector === 'function') {
            // selector就是DOM元素加载完毕之后的继续向下执行的回调函数
            //w.onload = selector;

            // 使用自己定义的函数来实现一个domReady(ele, fn)的功能, 默认就是整个document加载完毕之后才会继续向下执行
            // 使用call的时候第一个参数不能少哈， 否则传过去的参数就是空的
            //$$.onDOMReady.call(this, selector);

            // 使用apply传参的时候必须传递的是一个数组类型
            //$$.onDOMReady.apply(this, [selector]);

            // 如果使用bind的话(只是会修改调用函数内部的指向， 但是不会调用)
            // bind 是返回对应函数，便于稍后调用；apply 、call 则是立即调用 。【只是会返回一个函数， 但还是不会立即调用】
            require(['js/domReadyModule'], function (domReadyModule) {
                var func = domReadyModule.onReady.bind(self, selector);
                // 调用使用bind()方法返回的函数
                func();
            });
        } else {
            // 如果不是一个函数的话
            return new xframe(selector, context);
        }
    }

    // 添加一个extend方法， 用于扩充一个对象的方法， 扩展向一个类中拷贝方法
    $$.extend = function () {
        // 这里需要分为两种情况：
        // 1. 如果传过来的是一个参数的话，就相当于是给xframe对象添加方法
        // 2. 如果是两个参数的话，就相当于是给一个类扩充方法(把一个函数的方法拷贝到另一个类中去)
        var len = arguments.length,
            target = null,              // target 用来存储需要把方法拷贝进去的目标函数
            i = 1,                      // 初始化变量i, 表示需要开始遍历的起始位置标记
            key;                        // 为了防止定义太多的局部变量，可以把后面需要用到的所有局部变量事先在前面定义好
        if (len === 0) {
            return;
        } else if (len === 1) {
            // 给xrame对象添加方法
            target = xframe.prototype;
            i--;
        } else {
            // 两个参数的话，那么第一个参数就是我需要拷贝新的方法进去的目标对象
            // 如果是两个参数的话：就不需要修改变量i的值了， 直接从第一个位置开始，拿到第一个参数后， 把第二个参数的方法全部拷贝给第一个对象
            // 注意: 这里有可能也是三个参数或者是多个参数， 因此也可以吧后面的好几个对象的属性或者方法添加给第一个对象
            target = arguments[0];
        }


        // 确定好了target 这个目标对象以后，开始遍历原始对象那个source，把source里面的方法全部都拷贝到这个target对象里面
        for (; i < len; i++) {
            // 这里实际上在遍历一个json对象，json对象的每一项实际上就是一个属性或者方法
            // 遍历每一个arguments， 获取每一个参数的属性， 然后把这个属性拷贝到原始的对象
            for (key in arguments[i]) {
                target[key] = arguments[i][key];
            }
        }
        return target;
    }


    var w = window;
    // 为了把主框架里面的局部变量暴露出去供其他模块使用
    w.xframe = w.$ = $$;


    // 把当前的这个对象返回出去即可
    return $$;
});