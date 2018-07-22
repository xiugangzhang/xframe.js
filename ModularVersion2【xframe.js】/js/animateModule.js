/**
 * @Desc : 主要的功能模块展示
 * @Author : xiugang
 * @Time : 20180722
 */
// 动画框架的封装
define(['js/xframe'], function (xframe) {
    var api = {};

    api.Animate = function () {
        // 1. 定义需要的API接口(API内部用于放置属性)
        var api = {
            timer: null,// 这是一个动画循环句柄
            queen: []  // 多个对象同时运行的一个数组队列
        };


        // 运行部门-------------------------------------------------
        /**
         * 在把需要的运行参数都准备好了之后（多个对象），就开始执行这个运行函数
         */
        api.run = function () {
            // 定义一个定时器，用于不断地执行我自己定义的动画函数信息
            api.timer = setInterval(function () {
                // 由于所有的参数都已经准备好了，因此这里只需要直接进行循环操作即可
                api.loop();
            }, 16);     // 这里循环的周期设置的是16mm
        }
        /**
         * 执行动画循环操作
         */
        api.loop = function () {
            // obj里面存储了obj = {id, now, pass, tween, duration, style}
            api.queen.forEach(function (obj) {
                // 遍历队列中的每一项参数，开始执行移动操作
                api.move(obj);
            });
        }
        /**
         * 实现物体的移动
         */
        api.move = function (obj) {
            // 1. 计算当前的时间
            obj.pass = +new Date();
            // 2. 获取动画时间进程(这里的动画样式默认是一个弹簧的显示样式)
            var tween = api.getTween(obj.now, obj.pass, obj.duration, 'easeOutBounce');
            // 注意我们再每一次移动这个物体对象之前需要把这个物体对象的动画时间进程更新一下，这样到了后面的修改对象的属性的时候这个参数的数值才会动态改变
            obj.tween = tween;

            //console.log(tween);

            // 3. 设置属性信息
            if (tween >= 1) {
                // 如果动画时间进程结束了（百分比信息）
                api.stop();
            } else {
                // 4. 通过设置对象的属性信息来移动每一个对象
                api.setManyProperty(obj);
            }
        }

        // 添加部门-------------------------------------------------
        /**
         * @param 获取用户输入的参数，开始对参数进行解析，开始添加参数，然后实现动画的开始运行
         */
        api.add = function () {
            var args = arguments,
                id = args[0],
                json = args[1],
                duration = args[2];

            // 获取输入的参数，然后开始使用适配器解析数据
            try {
                // 1. 调用适配器准备参数
                api.adapterMany(id, json, duration);

                // 2. 开始运行动画
                api.run();
            } catch (e) {
                console.error(e.message);
            }
        }
        /**
         * 这是一个适配器，用于解析一个对象的参数信息(只能处理一个对象)
         * @param id
         * @param json
         * @param duration
         */
        api.adapterOne = function (id, json, duration) {
            var obj = {}                    // 这里的OBj就是一个字面量格式， 用于存储需要的参数信息
            obj.id = id                     // ID编号
            obj.now = +new Date()           // 开始时间
            obj.pass = 0                    // 当前时间
            obj.tween = 0                   // 动画时间进程
            obj.duration = duration         // 动画的持续时间
            obj.styles = []                 // 用于存放所有的样式信息

            // 根据用户输入的参数信息选择不同的动画速度
            if ($.isString(duration)) {
                switch (duration) {
                    case 'slow':
                    case '慢':
                        duration = 8000;
                        break;
                    case 'normal':
                    case '普通':
                        duration = 4000;
                        break;
                    case 'fast':
                    case '快':
                        duration = 1000;
                        break;
                }
            }

            // 设置样式信息
            obj.styles = api.getStyles(id, json);
            return obj;
        }
        /**
         * 这个适配器针对的是处理多个对象的动画信息
         * @param id
         * @param json
         * @param data
         */
        api.adapterMany = function (id, json, data) {
            // 处理多个对象的参数信息(同样的参数，但是需要处理不同的信息，针对的是多个对象的参数)
            var obj = this.adapterOne(id, json, data);
            // 开始向我已有的队列中添加数据信息（此时queen队列里面就是存放了我所有的数据信息）
            api.queen.push(obj);
        }
        /**
         * 获取样式信息
         * @param id
         * @param json
         */
        api.getStyles = function (id, json) {
            // animate('#sun', {left: 200, top : 500}, 7000);
            // 把用户传递过来的参数信息转换我需要的格式
            var styles = [];
            // 开始解析json数据信息
            for (var item in json) {
                var style = {};
                // 这里的item就是下面的：left, top
                style.name = item;
                // 获取物体开始的位置
                style.start = parseFloat($(id).css(item).toString());
                // 计算物体的偏移量（移动的距离）
                style.length = parseFloat(json[item]) - style.start;

                styles.push(style);
            }
            return styles;
        }
        /**
         * 用于获取一个动画时间进程
         * @param now 开始时间
         * @param pass 当前时间
         * @param all 持续时间
         * @param ease 动画效果
         */
        api.getTween = function (now, pass, all, ease) {
            // 1.定义常见的动画效果
            var eases = {
                //线性匀速
                linear: function (t, b, c, d) {
                    return (c - b) * (t / d);
                },
                //弹性运动
                easeOutBounce: function (t, b, c, d) {
                    if ((t /= d) < (1 / 2.75)) {
                        return c * (7.5625 * t * t) + b;
                    } else if (t < (2 / 2.75)) {
                        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                    } else if (t < (2.5 / 2.75)) {
                        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                    } else {
                        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                    }
                },
                //其他
                swing: function (t, b, c, d) {
                    return this.easeOutQuad(t, b, c, d);
                },
                easeInQuad: function (t, b, c, d) {
                    return c * (t /= d) * t + b;
                },
                easeOutQuad: function (t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b;
                },
                easeInOutQuad: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                    return -c / 2 * ((--t) * (t - 2) - 1) + b;
                },
                easeInCubic: function (t, b, c, d) {
                    return c * (t /= d) * t * t + b;
                },
                easeOutCubic: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t + 1) + b;
                },
                easeInOutCubic: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t + 2) + b;
                },
                easeInQuart: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t + b;
                },
                easeOutQuart: function (t, b, c, d) {
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                },
                easeInOutQuart: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
                },
                easeInQuint: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t * t + b;
                },
                easeOutQuint: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                },
                easeInOutQuint: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
                },
                easeInSine: function (t, b, c, d) {
                    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
                },
                easeOutSine: function (t, b, c, d) {
                    return c * Math.sin(t / d * (Math.PI / 2)) + b;
                },
                easeInOutSine: function (t, b, c, d) {
                    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
                },
                easeInExpo: function (t, b, c, d) {
                    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
                },
                easeOutExpo: function (t, b, c, d) {
                    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
                },
                easeInOutExpo: function (t, b, c, d) {
                    if (t == 0) return b;
                    if (t == d) return b + c;
                    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
                },
                easeInCirc: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
                },
                easeOutCirc: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                },
                easeInOutCirc: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
                },
                easeInElastic: function (t, b, c, d) {
                    var s = 1.70158;
                    var p = 0;
                    var a = c;
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * .3;
                    if (a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                },
                easeOutElastic: function (t, b, c, d) {
                    var s = 1.70158;
                    var p = 0;
                    var a = c;
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * .3;
                    if (a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
                },
                easeInOutElastic: function (t, b, c, d) {
                    var s = 1.70158;
                    var p = 0;
                    var a = c;
                    if (t == 0) return b;
                    if ((t /= d / 2) == 2) return b + c;
                    if (!p) p = d * (.3 * 1.5);
                    if (a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
                },
                easeInBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c * (t /= d) * t * ((s + 1) * t - s) + b;
                },
                easeOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                },
                easeInOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
                },
                easeInBounce: function (t, b, c, d) {
                    return c - this.easeOutBounce(d - t, 0, c, d) + b;
                },
                easeInOutBounce: function (t, b, c, d) {
                    if (t < d / 2) return this.easeInBounce(t * 2, 0, c, d) * .5 + b;
                    return this.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                }
            };
            // 2. 计算每一次动画循环的小号时长
            var yongshi = pass - now;

            // 3. 获取相应的动画效果
            return eases[ease](yongshi, 0, 1, all);
        }

        /**
         * 通过设置一个对象的属性信息来实现物体的运动效果（如果只有一个属性信息的话）
         * @param obj
         */
        api.setOneProperty = function (obj) {
            // 用于设置一个对象的属性信息(obj.id, obj.json)
            // 【注意点】：这里是动画实现的一个核心要点，通过修改对象的属性信息来移动物体
            if (obj.name === 'opacity') {
                $(obj.id).css(obj.name, (obj.start + obj.length * obj.tween));
            } else {
                // 对于设置对象的其他属性信息都是需要添加一个px，像素值信息
                $(obj.id).css(obj.name, (obj.start + obj.length * obj.tween) + 'px');
                console.log($(obj.id), obj.name, (obj.start + obj.length * obj.tween) + 'px');
            }
        }
        /**
         * 用于设置一个对象的锁哥属性信息 obj.json = {width : '200px', height : '500px', 'opacity' : '0.1'}
         */
        api.setManyProperty = function (obj) {
            // 由于obj.styles里面是一个数组
            obj.styles.forEach(function (style) {
                // 遍历当前对象的所有样式属性信息
                obj.name = style.name;
                obj.start = style.start;
                obj.length = style.length;
                api.setOneProperty(obj);
                console.log(obj.tween);
            });

            // 由于styles里面只存储了style.name, style.start, style.length三个属性信息， 因此需要处理一下

        }
        /**
         * 结束动画的执行
         */
        api.stop = function () {
            clearInterval(api.timer);
        }

        // 后勤部门----------------------------------------------------
        api.destory = function () {

        }


        // 用户只需要把需要的参数添加进来们就可以执行一个动画
        // 用户只需要传进来三个参数，id, json, duration就可以实现一个动画
        xframe.animate = api.add;
    };

    // 执行函数
    api.Animate();

    return api;
});