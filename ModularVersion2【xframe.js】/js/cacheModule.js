/**
 * @Desc : 主要的功能模块展示
 * @Author : xiugang
 * @Time : 20180722
 */
// 缓存框架的封装
define(['js/xframe'], function (xframe) {
    var  api  ={};
    api.cache = {
        data: [],          // 用于存储本地的数据信息
        /**
         * 用于获取本地存储的json数据信息
         * @param key
         * @return {*}
         */
        get: function (key) {
            var value = null;
            this.data.each(function () {
                if (key.trim() === this.key.trim()) {
                    value = this.value;
                }
            });
            return value;
        },
        /**
         * 向本地存储添加数据信息
         * @param key
         * @param value
         */
        add: function (key, value) {
            this.data.push({
                key: key.trim(),
                value: value.trim()
            });
        },
        /**
         * 删除指定的key的数据信息
         * @param key
         * @return {boolean}
         */
        delete: function (key) {
            // 删除指定的key对应的数据信息
            var status = false,     // 定义一个状态码，用于标记删除是否成功的状态信息
                self = this;
            this.data.forEach(function (element, index) {
                // 遍历本地的数据存储信息，进行比对数据信息
                if (key.trim() === element.key.trim()) {
                    // 指定开始的位置，开始删除数组中的数据信息
                    self.data.splice(index, 1);
                    status = true;
                }
            });
            return status;
        },
        /**
         * 修改指定的元素的数据信息
         * @param key
         * @param value
         */
        update: function (key, value) {
            var status = false;
            this.data.forEach(function (element) {
                if (key.trim() === element.key) {
                    // key不变，只修改数值信息, 注意element是一个json对象，这个对象里面包含了两个属性element.key和element.value这两个
                    element.value = value.trim();
                    status = true;
                }
            });
            return status;
        },
        /**
         * 检测一个指定的数据是否存在
         * @param key
         * @return {boolean}
         */
        isExist: function (key) {
            // 用于检测某一个数据信息是否存在
            this.data.forEach(function () {
                if (key.trim() === this.key) {
                    return true;
                }
            });
            return false;
        }
    }


    /**
     * 实现了一个Cookie框架的封装（注意在把HTML转换为实体存储的时候这里默认是去掉了最末尾的分号）
     * @type {{getCookie: xframe.cookie.getCookie, setCookie: xframe.cookie.setCookie, deleteCookie: xframe.cookie.deleteCookie, clearAllCookies: xframe.cookie.clearAllCookies}}
     */
    api.cookie = {
        /**
         * 根据cookie的名字获取Cookie的详细信息
         * @param name
         * @return {*}
         */
        getCookie: function (name) {
            // 去除转义字符
            var name = name.escapeHTML(),
                // 读取文档中的所有cookie属性
                allCookies = document.cookie;

            // 下面是一些Cookie的数据格式信息（默认返回的是一个字符串）
            // H_PS_645EC=af88R0s3e76Ig1PlwkvrhnGGtg4qt5pcZNPKBUntPI2vGearAlyZyjXjmKYn%2BkggUXbNjhg;
            // 1. 查找名称为name的cookie信息script3&amp5;
            //name = name.substring(0, name.length-1);            //  当前步骤是为了去除掉末尾的分号(转换为标准形式);
            name += '=';
            // 等号右边的就是获取的数值，左边就是cookie的名称信息
            // 2. 获取'name='这个字符串在整个Cookie信息字符串中出现的位置下标
            var pos = allCookies.indexOf(name);
            // 3. 判断是否存在这个cookie的信息
            if (pos !== -1) {
                // 如果存在的话，就继续处理
                // 3. 计算'cookie='等号后面的位置
                var start = pos + name.length;
                // 3. 从'cookie='的位置开始向后搜索， 一直到;的位置结束, 从start的位置向后搜索信息
                var end = allCookies.indexOf(';', start);
                if (end === -1) {
                    // 如果为-1的话， 说明cookie信息列表里面只有一个Cookie信息
                    end = allCookies.length;
                }
                // 4. 提取Cookie的数值信息
                var value = allCookies.substring(start, end);
                // 5.处理之后反转义后返回(反转义的目的是将内容进行加密处理，防止攻击)【测试状态OK，由于之前的内部存储，必须先删除所有的，在执行就ok了】
                return value.unescapeHTML();
            } else {
                // 没有找到， 说明不存在这个cookie信息
                return '';
            }

            // 默认情况下返回一个空的字符串
            return '';
        },
        /**
         * 根据传入的参数信息设置浏览器的cookie
         * @param name
         * @param value
         * @param days
         * @param path
         */
        setCookie: function (name, value, days, path) {
            var name = name.escapeHTML(),
                value = value.escapeHTML(),
                expires = new Date(),
                _expires,
                res;

            //name = name.substring(0, name.length-1);            //  当前步骤是为了去除掉末尾的分号(转换为标准形式);

            // 设置cookie的过期时间(单位是毫秒)
            expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
            if (path === '') {
                path = '';
            } else {
                path = (';path=' + path);
            }

            if (typeof expires === 'string') {
                _expires = '';
            } else {
                // 使用UTC标准时间
                _expires = (';expires=' + expires.toUTCString());
            }

            // 设置cookie信息，【注意要点：】(设置COokie的时候，只要遇到分号就会立即结束，只会保存分号之前的内容)
            res = name + '=' + value + _expires + path;
            // document.cookie="userId=828; userName=hulk";
            document.cookie = res;
        },
        /**
         * 根据名称信息和路径信息删除cookie
         * @param name
         * @param path
         */
        deleteCookie: function (name, path) {
            var name = name.escapeHTML(),
                expires = new Date();
            if (path === '') {
                path = '';
            } else {
                path = (';path=' + path);
            }

            // 删除之后重新设置cookie
            document.cookie = name + '=' + ';expires=' + expires.toUTCString() + path;
        },
        /**
         * 清空所有的cookie信息
         */
        clearAllCookies: function () {
            // 1. 获取浏览器中存储的所有cookie信息
            // "name&amp=xiuxiu&amp; name=xiuxiu; script=<script>alert(2); script2=<script>alert(2); script3=<script>alert(2); script3&amp=&ltscript&gtalert(2); script4&amp=&ltscript&gtalert(2); a&amp=&lta&gtalert(2)&lt/a&gt&amp"
            var cookies = document.cookie.split(';');
            if (cookies.length) {
                cookies.forEach(function (element) {
                    // 拿到字符串：name&amp=xiuxiu&amp
                    var index = element.indexOf('='),
                        name = element.substring(0, index);

                    // 实现思路：要想删除某一个COOkie信息，只需要将cookie的name对应的值设置为空即可
                    document.cookie = name + '=' + ';expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                });
            }

        }
    }


    // 本地存储框架localstorage的本地存储
    api.store = (function (xframe) {
        // 定义一个API，用于定义实现的本地存储的API接口
        var api = {},
            localStorageName = 'localStorage',
            globalStorageName = 'globalStorage',
            win = window,
            doc = window.document,
            storage;


        // 首先先定义要实现的功能接口
        api.set = function (key, value) {

        }
        api.get = function (key) {

        }
        api.remove = function (key) {

        }
        api.clear = function () {

        }


        /*
        *   a) sessionStorage和localStorage都是window的属性，也是Storage对象的实例，即：window.sessionStorage instanceof Storage返回True，window.localStorage instanceof Storage 返回True,也因此两者享有Storage的属性和方法。
            b) sessoinStorage存储的数据在页面会话结束时会被清空，页面会话在浏览器窗口关闭前持续存在，包含页面刷新和恢复。若新开标签或窗口将新建一个会话，再次获取sessionStorage将只限于当前会话，与先前会话的无关。localStorage存储的数据不会
            c) window.globalStorage自Gecko 13 (Firefox 13)起不再支持。
        *
        * */
        if (localStorageName in win && win[localStorageName]) {
            // 拿到本地存储的这个数据项
            storage = win[localStorageName];

            // 实现我自己定义的接口
            /**
             * 设置本地存储的内容
             * @param key
             * @param value
             */
            api.set = function (key, value) {
                storage.setItem(key, value);
            }
            /**
             * 获取本地存储的内容
             * @param key
             * @return {*}
             */
            api.get = function (key) {
                return storage.getItem(key);
            }
            /**
             * 移出其中的某一项
             * @param key
             */
            api.remove = function (key) {
                storage.removeItem(key);
            }
            /**
             * 清空本地存储的所有内容
             */
            api.clear = function () {
                storage.clear();
            }
        } else if (globalStorageName in win && win[globalStorageName]) {
            // HTML5中的localStorage替换了原来的globalStorgae
            // 1. 拿到本地存储的对象(这是一个Json对象)[Firefox浏览器]
            storage = win[globalStorageName][win.location.hostname];
            api.set = function (key, value) {
                storage[key] = value;
            }
            api.get = function (key) {
                return storage[key] && storage[key].value;
            }
            api.remove = function (key) {
                // delete用来删除一个对象的属性。
                delete storage[key];
            }
            api.clear = function () {
                for (var key in storage) {
                    delete storage[key];
                }
            }
        } else if (doc.documentElement.addBehavior) {
            // 如果可以给一个对象添加行为的话
            //  单独定义一个获取本地存储的对象storage
            function getStorage() {
                // 如果已经获取到了Storage对象的话
                if (storage) {
                    return storage;
                }
                storage = doc.body.appendChild(doc.createElement('div'));
                storage.style.display = 'none';
                // userData 64KB IE专用
                storage.addBehavior('#default#userData');
                // 这个是微软自定义的一个本地存储，相比之下有更大的容量
                storage.load(localStorageName);
                return storage;
            }

            api.set = function (key, value) {
                var storage = getStorage();
                // 设置属性
                storage.setAttribute(key, value);
                // 保存属性信息
                storage.save(localStorageName);
            }
            api.get = function (key) {
                var storage = getStorage();
                return storage.getAttribute(key);
            }
            api.remove = function (key) {
                var storage = getStorage();
                storage.removeAttribute(key);
                // 移出数据之后记得保存一下数据
                storage.save(localStorageName);
            }
            api.clear = function () {
                // 1. 获取Storage对象
                var storage = getStorage();
                // 2.获取storage对象存储的所有属性信息
                var attributes = storage.XmlDocument.documentElement.attributes;
                storage.load(localStorageName);
                // 3. 遍历所有的属性信息，并从本地移出数据
                [].slice.call(attributes).forEach(function (element) {
                    storage.removeAttribute(element.name);
                })
                // 4. 移出完毕之后，开始保存信息到本地存储
                storage.save(localStorageName);
            }

            return api;
        }

        // 把立即函数里面的私有成员暴露出去(如果在立即函数内部不暴露出去需要使用的成员，在外部是无法访问到内部的私有成员变量的)
        xframe.storage = api;

    })(xframe);



    return api;
});