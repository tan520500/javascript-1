/**
 * lazyQuery.js
 * CreateTime: 2015-05-22
 * CreateUser: 65758075@qq.com
 * Charset: UTF-8
 * Tool: WebStorm 10.0.1
 * 测试环境：MacBook OS X El Capitan V10.11.1
 * 浏览器版本:
 * Mac -> ["Chrome", "42.0.2311.152"] ["Firefox", "45.0"] ["Safari", "9.0.1"] ["Opera", "36.0.2130.32"]
 * Win -> ["IE", "7.0"] ["IE", "8.0"] ["IE", "9.0"] ["IE", "10.0"] ["IE", "11.0"] ["Firefox", "45.0"] ["Chrome", "49.0.2623.87"]
 * last fix time: 2017-01-22
 */

(function(window){
    //私有变量
    var window = window,
        document = window.document,
        navigator = window.navigator,
        _systemStr = navigator.appVersion.toLowerCase(),
        _userAgent = navigator.userAgent.toLowerCase();
    /**
     * 获取指定名称的标签
     * @param Obj  {Function} or {String}
     * @param FindRang  查询范围
     * @return {array} or {element}
     */
    //暴露唯一全局变量 "MM"
    var MM = window.MM = function(Obj, FindRange){
            if(arguments.length === 0){
                return MM;
            }else if(arguments.length === 1 && typeof Obj === "function"){ //function预加载
                return MM.ready(Obj);
            }else if(typeof Obj === "string"){
                FindRange = FindRange || document;
                switch(Obj.charAt(0)){
                    case "#": //获取id
                        return typeof Obj === "string" ? document.getElementById(Obj.substring(1)) : Obj.substring(1);
                        break;
                    case ".": //获取className
                        var i,
                            reg = new RegExp("(^|\\s)" + Obj.substring(1) + "(\\s|$)"),
                            arrClass = [],
                            allElem = MM("*", FindRange),
                            leg = allElem.length;
                        for(i = 0; i < leg; i++){
                            reg.test(allElem[i].className) && arrClass.push(allElem[i]);
                        }
                        return arrClass;
                        break;
                    case "@": //获取name
                        return FindRange.getElementsByName(Obj.substring(1));
                        break;
                    default: //获取element
                        return FindRange.getElementsByTagName(Obj);
                        break;
                }
            }
        };
    /**
     * 命名空间
     * @param nameStr 空间名称字符串
     * @example
     *     MM.nameSpace('A');
     *     A.name = 111;
     *     MM.nameSpace('A.CAT');
     *     A.CAT.name = 222;
     *     MM.nameSpace('A.CAT.MOON');
     *     A.CAT.MOON.name = 333;
     *     console.log(window.A);
     */
    MM.nameSpace = function(nameStr){
        var nsArr = nameStr.split(".");
        var evalStr = "";
        var nsStr = "";
        for(var i = 0; i < nsArr.length; i++){
            if(i != 0){
                nsStr += ".";
            }
            nsStr += nsArr[i];
            evalStr += "if(typeof " + nsStr + " === 'undefined'){" + nsStr + " = new Object();}";
        }
        if(evalStr != ""){
            eval(evalStr);
        }
    };
    /**
     * 文档激活后加载函数
     * @param  Fn 预加载函数
     */
    MM.ready = function(Fn){
        if(!Fn || typeof Fn !== "function"){
            return console.info("MM.ready参数故障！");
        }
        if(document.addEventListener){ //IE9+、Chrome、Firefox、Safari、Opera
            document.addEventListener("DOMContentLoaded", function(){
                document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                Fn();
            }, false);
        }else if(document.attachEvent){ //IE6、IE7、IE8
            document.attachEvent("onreadystatechange", function(){
                if(document.readyState === "complete"){
                    document.detachEvent("onreadystatechange", arguments.callee);
                    Fn();
                }
            });
        }
    };
    /**
     * 获取id标签
     * @param $ 目标#id名称
     * @returns {Element}
     */
    MM.$ = function(Id){
        var idElem = document.getElementById(Id) || false;
        if(typeof Id === "string" && idElem){
            return idElem;
        }
        return console.info("没有获取到ID值:" + Id);
    };
    /**
     * 获取Element
     * @param TargetElem 目标标签
     * @param FindRange 查找范围,默认为全局
     * @returns {HTMLCollection}
     */
    MM.getElem = function(TargetElem, FindRange){
        if(!TargetElem){
            return console.info("MM.getElem参数故障！");
        }
        return (FindRange || document).getElementsByTagName(TargetElem);
    };
    /**
     * 获取所有兄弟标签
     * @param TargetElem 目标节点
     * @returns {Array}
     */
    MM.siblings = function(TargetElem){
        if(!TargetElem){
            return console.info("MM.siblings参数故障！");
        }
        var arr = [];
        var prevNode = TargetElem.previousSibling;
        while(prevNode){
            if(prevNode.nodeType === 1){
                arr.push(prevNode);
            }
            prevNode = prevNode.previousSibling;
        }
        arr.reverse();
        var nextNode = TargetElem.nextSibling;
        while(nextNode){
            if(nextNode.nodeType === 1){
                arr.push(nextNode);
            }
            nextNode = nextNode.nextSibling;
        }
        return arr;
    };
    /**
     * 获取全部class
     * @param ClassName class名称
     * @param FindRange 查找范围，默认为全局
     * @returns {HTMLCollection}
     */
    MM.getClass = function(ClassName, FindRange, TagName){
        if(typeof ClassName !== "string"){
            return console.info("MM.getClass参数故障！");
        }
        TagName = TagName || "*";
        if(document.getElementsByClassName){
            return (FindRange || document).getElementsByClassName(ClassName);
        }else{
            var allElem = (FindRange || document).getElementsByTagName(TagName),
                arrClass = [],
                i,
                m,
                n,
                leg = allElem.length;
            for(i = 0; i < leg; i++){
                for(m = 0, n = allElem[i].className.split(/\s+/); m < n.length; m++){
                    if(n[m] == ClassName){
                        arrClass.push(allElem[i]);
                        break;
                    }
                }
            }
            return arrClass;
        }
    };
    /**
     * 获取第一层全部子集元素
     * @param ParentElem 目标的父级id
     * @returns {Array}
     */
    MM.children = function(ParentElem){
        if(!ParentElem){
            return console.info("MM.children参数故障！");
        }
        var arrChild = [],
            i,
            subset = ParentElem.childNodes;
        for(i = 0; i < subset.length; i++){
            if(subset[i].nodeType === 1){
                arrChild.push(subset[i]);
            }
        }
        return arrChild;
    };
    /**
     * 判断元素是否包含指定className
     * @param TargetElem 目标标签id
     * @param ClassName class名称
     * @returns {boolean}
     */
    MM.hasClass = function(TargetElem, ClassName){
        if(!TargetElem && typeof ClassName !== "string"){
            return console.info("MM.hasClass参数故障！");
        }
        return new RegExp("(^|\\s)" + ClassName + "(\\s|$)").test(TargetElem.className);
    };
    /**
     * 添加className
     * @param TargetElem 目标标签id
     * @param ClassName class名称
     * @return {}
     */
    MM.addClass = function(TargetElem, ClassName){
        if(typeof ClassName !== "string" && !TargetElem){
            return console.info("MM.addClass参数故障！");
        }
        var arrClass = TargetElem.className.split(/\s+/);
        MM.hasClass(TargetElem, ClassName) || arrClass.push(ClassName);
        TargetElem.className = arrClass.join(" ").replace(/(^\s*)|(\s*$)/, "");
    };
    /**
     * 删除class
     * @param  TargetElem 目标标签id
     * @param  ClassName class名称
     * @return {}
     */
    MM.removeClass = function(TargetElem, ClassName){
        if(!TargetElem && typeof ClassName !== "string"){
            return console.info("MM.removeClass参数故障！");
        }
        TargetElem.className = TargetElem.className.replace(new RegExp("(^|\\s)" + ClassName + "(\\s|$)", "g"), "").split(/\s+/).join(" ");
    };
    /**
     * 切换className
     * @param  TargetElem 目标标签
     * @param  ClassName class名称
     * @return {}
     */
    MM.toggleClass = function(TargetElem, ClassName){
        if(!TargetElem && typeof ClassName !== "string"){
            return console.info("MM.toggleClass参数故障！");
        }
        MM.hasClass(TargetElem, ClassName) ? MM.removeClass(TargetElem, ClassName) : MM.addClass(TargetElem, ClassName);
    };
    /**
     * 设置透明度
     * @param TargetElem 透明元素
     * @param Val 透明值 0~100
     */
    MM.setOpacity = function(TargetElem, Val){
        if(!TargetElem && typeof Val !== "number"){
            return console.info("MM.setOpacity参数故障！");
        }
        if(TargetElem.filters){
            TargetElem.style.filter = "alpha(opacity=" + Val * 100 + ")";
        }else{
            TargetElem.style.opacity = Val;
        }
    };
    /**
     * 淡入效果(含淡入到指定透明度)
     * @param TargetElem 需要淡入的元素
     * @param Speed 淡入速度,正整数(可选)
     * @param Opacity 淡入到指定的透明度,0~100(可选)
     * @param Callback 回调函数
     */
    MM.fadeIn = function(TargetElem, Speed, Opacity, Callback){
        if(!TargetElem){
            return console.info("MM.fadeIn参数故障！");
        }
        var speed = Speed || 20;
        var opacity = Opacity || 100;
        //显示元素,并将元素值为0透明度(不可见)
        TargetElem.style.display = "block";
        MM.setOpacity(TargetElem, 0);
        //初始化透明度变化值为0
        var val = 0;
        //循环将透明值以5递增,即淡入效果
        (function(){
            MM.setOpacity(TargetElem, val);
            val += 5;
            if(val <= opacity){
                setTimeout(arguments.callee, speed)
            }else if(val > opacity){
                Callback && Callback();
            }
        })();
    };
    /**
     * 淡出效果(含淡出到指定透明度)
     * @param TargetElem 需要淡入的元素
     * @param Speed 淡入速度,正整数(可选)
     * @param Opacity 淡入到指定的透明度,0~100(可选)
     * @param Callback 回调函数
     */
    MM.fadeOut = function(TargetElem, Speed, Opacity, Callback){
        if(!TargetElem){
            return console.info("MM.fadeOut参数故障！");
        }
        var speed = Speed || 20;
        var opacity = Opacity || 0;
        //初始化透明度变化值为0
        var val = 100;
        //循环将透明值以5递减,即淡出效果
        (function(){
            MM.setOpacity(TargetElem, val);
            val -= 5;
            if(val >= opacity){
                setTimeout(arguments.callee, speed);
            }else if(val < 0){
                //元素透明度为0后隐藏元素
                TargetElem.style.display = "none";
                Callback && Callback();
            }
        })();
    };
    /**
     * 缓冲动画/同步动画
     *   @param TargetElem 动画元素
     *   @param StyleJson 样式对象 {width:100, height:200, opacity:0}
     *   @param Fn 缓冲执行函数
     *   @example
     *   MM.animate(box, {width:400, height:200}, function(){
     *        MM.animate(box, {height:400}, function(){
     *            MM.animate(box, {opacity:10},function(){
     *                console.log("链式动画");
     *            });
     *        });
     *    });
     *   @example
     *   MM.animate(box, {width:101, height:400, opacity:20}, function(){
     *       console.log("同步动画");
     *   });
     */
    MM.animate = function(TargetElem, StyleJson, Fn){
        if(!TargetElem && typeof StyleJson !== "object"){
            return console.info("MM.animate参数故障！");
        }
        var currentVal = 0;
        clearInterval(TargetElem.timer);
        TargetElem.timer = setInterval(function(){
            var flag = true;
            for(var Attr in StyleJson){
                if(StyleJson.hasOwnProperty(Attr)){
                    if(Attr == "opacity"){
                        currentVal = Math.round(parseFloat(MM.getStyle(TargetElem, Attr)) * 100);
                    }else{
                        currentVal = parseInt(MM.getStyle(TargetElem, Attr));
                    }
                    var speed = (StyleJson[Attr] - currentVal) / 8; //动画速度
                    speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                    if(currentVal != StyleJson[Attr]){
                        flag = false;
                    }
                    if(Attr == "opacity"){
                        TargetElem.style.filter = "alpha(opacity=" + (currentVal + speed) + ")";
                        TargetElem.style.opacity = (currentVal + speed) / 100;
                    }else{
                        TargetElem.style[Attr] = currentVal + speed + "px";
                    }
                }
            }
            if(flag){
                clearInterval(TargetElem.timer);
                if(Fn){
                    Fn();
                }
            }
        }, 30);
    };
    /**
     * 判断标签是否存在指定属性
     * @param TargetElem 标签id
     * @param Attr 属性名称
     * @returns {boolean}
     */
    MM.hasAttr = function(TargetElem, Attr){
        if(!TargetElem && typeof Attr !== "string"){
            return console.info("MM.hasAttr参数故障！");
        }
        return TargetElem.getAttribute(Attr) != null;
    };
    /**
     * 获取或设置属性值
     * @param  TargetElem 目标标签
     * @param  Attr 属性名称
     * @param  Val 属性值
     * @return {string}
     */
    MM.attr = function(TargetElem, Attr, Val){
        if(!TargetElem && typeof Attr !== "string"){
            return console.info("MM.attr参数故障！");
        }
        if(!!Val){
            var newAttr = document.createAttribute(Attr);
            newAttr.value = Val;
            TargetElem.setAttributeNode(newAttr);
            return;
        }
        if(!!TargetElem.getAttributeNode(Attr)){
            return TargetElem.getAttributeNode(Attr).value;
        }else{
            return null;
        }
    };
    /**
     * 删除属性值
     * @param  TargetElem 目标标签id
     * @param  Attr 属性名称
     */
    MM.removeAttr = function(TargetElem, Attr){
        if(!TargetElem && typeof Attr !== "string"){
            return console.info("MM.removeAttr参数故障！");
        }
        if(!TargetElem){
            return;
        }
        switch(Attr){
            case "class":
            case "className":
                TargetElem.removeAttribute("class");
                TargetElem.removeAttribute("className");
                break;
            default:
                TargetElem.removeAttribute(Attr);
        }
    };
    /**
     * 获取上一个兄弟标签
     * @param  TargetElem 目标标签id
     * @return {Element}
     */
    MM.prev = function(TargetElem){
        if(!TargetElem){
            return console.info("MM.prev参数故障！");
        }
        var prev = TargetElem.previousSibling;
        if(prev == null){
            return null;
        }
        while(prev && prev.nodeType != 1){
            prev = prev.previousSibling;
        }
        return prev;
    };
    /**
     * 获取下一个兄弟标签
     * @param  TargetElem 目标标签id
     * @return {Element}
     */
    MM.next = function(TargetElem){
        if(!TargetElem){
            return console.info("MM.next参数故障！");
        }
        var next = TargetElem.nextSibling;
        if(next == null){
            return null;
        }
        while(next && next.nodeType != 1){
            next = next.nextSibling;
        }
        return next;
    };
    /**
     * 指定标签之后插入标签
     * @param  InsertElem 插入标签id
     * @param  TargetElem 目标标签id
     */
    MM.after = function(TargetElem, InsertElem){
        if(!TargetElem){
            return console.info("MM.after参数故障！");
        }
        var parentElem = TargetElem.parentNode;
        if(parentElem.lastChild == TargetElem){
            parentElem.appendChild(InsertElem);
        }else{
            parentElem.insertBefore(InsertElem, TargetElem.nextSibling);
        }
    };
    /**
     * 指定标签之前插入标签
     * @param InsertElem 插入标签id
     * @param TargetElem 目标标签id
     */
    MM.before = function(TargetElem, InsertElem){
        if(!TargetElem){
            return console.info("MM.before参数故障！");
        }
        TargetElem.parentNode.insertBefore(InsertElem, TargetElem);
    };
    /**
     * 事件绑定
     * @param  TargetElem (element)字符串
     * @param  Type 事件类型 click/mouseover/mouseout/focus/blur/...
     * @param  Fn 事件执行的函数
     */
    MM.bind = function(TargetElem, Type, Fn){
        if(!TargetElem && typeof Type !== "string"){
            return console.info("MM.bind参数故障！");
        }
        return TargetElem.addEventListener ? TargetElem.addEventListener(Type, Fn, false) : TargetElem.attachEvent("on" + Type, Fn);
    };
    /**
     * 删除事件绑定
     * @param  TargetElem (element)字符串
     * @param Type 事件类型 click/mouseover/mouseout/focus/blur/...
     * @param Fn 事件执行的函数
     */
    MM.unbind = function(TargetElem, Type, Fn){
        if(!TargetElem && typeof Type !== "string"){
            return console.info("MM.unbind参数故障！");
        }
        if(TargetElem.addEventListener){
            TargetElem.removeEventListener(Type, Fn, false);
        }else{
            TargetElem.detachEvent("on" + Type, Fn);
        }
    };
    /**
     * 阻止事件冒泡
     * @param  e 事件对象
     * @example  MM.stopBubble(e);
     */
    MM.stopBubble = function(e){
        e = e || window.event;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !!1;
    };
    /**
     * 取消默认行为
     * @param  e 事件对象
     * @example  MM.stopDefault(e);
     */
    MM.stopDefault = function(e){
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = !!0;
    };
    /**
     * 获取目标事件对象
     * @param  E 事件对象
     * @example  MM.getTarget(e);
     */
    MM.target = function(E){
        E = E || window.event;
        var target = E.target || E.srcElement;
        return target;
    };
    /**
     * 获取浏览器类型和版本
     * @return [浏览器名称，版本号]
     * @example
     *     console.log(MM.browser); //["Chrome", "42.0.2311.152"]
     */
    MM.browser = (function(){
        var thisFn = arguments.callee;
        //如果 thisFn.saveValue 有存储值，则返回;否则将执行 function 获取
        return thisFn.saveValue || (thisFn.saveValue = (function(){
                //IE6、IE7、IE8、IE9、IE10
                if(/msie/.test(_userAgent)){
                    return ["IE", _userAgent.match(/msie ([\d.]+)/)[1]];
                }
                //IE11
                if(/rv/.test(_userAgent) && /trident/.test(_userAgent)){
                    return ["IE", _userAgent.match(/rv:([\d.]+)/)[1]];
                }
                //Firefox
                if(/firefox/.test(_userAgent)){
                    return ["Firefox", _userAgent.match(/firefox\/([\d.]+)/)[1]];
                }
                //Opera
                if(/opr/.test(_userAgent)){
                    return ["Opera", _userAgent.match(/opr\/([\d.]+)/)[1]];
                }
                //Chrome
                if((/chrome/.test(_userAgent)) && !(/opr/.test(_userAgent))){
                    return ["Chrome", _userAgent.match(/chrome\/([\d.]+)/)[1]];
                }
                //Safair
                if(/version/.test(_userAgent)){
                    return ["Safari", _userAgent.match(/version\/([\d.]+)/)[1]];
                }
                //Other
                return ["Other", null];
            }()));
    }());
    /**
     * 浏览器类型判断
     * @return {blooean}
     * @example
     *     console.log(MM.isChrome); //true
     */
    MM.isIE = ((window.navigator.appName.indexOf("Microsoft") && _userAgent.indexOf("trident")) !== -1);
    MM.isIE6 = (MM.isIE && MM.browser[1] === "6.0");
    MM.isIE7 = (MM.isIE && MM.browser[1] === "7.0");
    MM.isIE8 = (MM.isIE && MM.browser[1] === "8.0");
    MM.isIE9 = (MM.isIE && MM.browser[1] === "9.0");
    MM.isIE10 = (MM.isIE && MM.browser[1] === "10.0");
    MM.isIE11 = (MM.isIE && MM.browser[1] === "11.0");
    MM.isFirefox = (/firefox/.test(_userAgent));
    MM.isOpera = (/opr/.test(_userAgent));
    MM.isChrome = ((/chrome/.test(_userAgent)) && !(/opr/.test(_userAgent)));
    MM.isSafari = (/version/.test(_userAgent));
    /**
     * 单击和双击事件共存
     * @param DOM 绑定事件的DOM节点
     * @param ClickFn 单击执行函数
     * @param DblclickFn 双击执行函数
     * @example
     * var boxId = document.getElementById("box");
     * MM.clickFit(boxId, ClickFn, DblclickFn);
     */
    MM.clickFit = function(DOM, ClickFn, DblclickFn){
        if(!DOM){
            return console.info("MM.clickFit参数故障！");
        }
        var clickTimer = null;
        var clickCheck = function(){
            if(clickTimer){
                window.clearTimeout(clickTimer);
                clickTimer = null;
            }
            clickTimer = window.setTimeout(function(){
                ClickFn(); //单击执行
            }, 500);
        };
        var dblclickCheck = function(){
            if(clickTimer){
                window.clearTimeout(clickTimer);
                clickTimer = null;
            }
            DblclickFn(); //双击执行
        };
        DOM.onclick = clickCheck;
        DOM.ondblclick = dblclickCheck;
    };
    /**
     * 鼠标滑轮滚动事件绑定
     * @param  TargetElem (element)字符串
     * @param  Type 滑轮事件(mousewheel)
     * @param  Fn 事件执行函数
     * @example  MM.onwheel(elem, "mousewheel", function(e) {
     *     console.log(e.delta);
     * });
     */
    MM.wheelListen = (function(){
        var eventCompat = function(e){
            //兼容处理
            e = e || window.event;
            var type = e.type;
            if(type === "DOMMouseScroll" || type === "mousewheel"){
                e.delta = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail) / 3;
            }
            e.target = e.target || e.srcElement;
            //如果 Elem === window 注释掉下行代码
            e.preventDefault ? e.preventDefault() : e.returnValue = !!0;
            return e;
        };
        if(window.addEventListener){
            return function(Elem, Type, Fn){
                if(Type === "mousewheel" && document.mozHidden !== undefined){ //Firefox
                    Type = "DOMMouseScroll";
                }
                Elem.addEventListener(Type, function(e){
                    Fn.call(this, eventCompat(e));
                }, false);
            }
        }else if(window.attachEvent){
            return function(Elem, Type, Fn){
                Elem.attachEvent("on" + Type, function(e){
                    Fn.call(this, eventCompat(e));
                });
            }
        }
        return function(){
        };
    }());
    /**
     * 防止onresize执行频率过快
     * @param Fn 事件执行函数
     * @param Delay 执行间隔时间(默认100ms)
     * @example window.onresize = easeOnresize(function() {
     *     console.log("test");
     * }, 200);
     */
    MM.easeOnresize = function(Fn, Delay){
        var timeout = null;
        return function(){
            var self = this,
                args = arguments;
            var delayed = function(){
                Fn.apply(self, args);
                timeout = null;
            };
            if(timeout){
                clearTimeout(timeout);
            }
            timeout = setTimeout(delayed, Delay || 100);
        };
    };
    /**
     * 事件名称自定义
     * @param Type 事件类型（名称自定义）
     * @param Fn 事件执行函数
     * @return {object}
     * add(添加函数) trigger(触发函数) remove(删除函数)
     * @example
     * MM.customEvent.add("wjw", Fn);
     * MM.customEvent.trigger("wjw");
     */
    MM.customEvent = {
        listeners: {},
        add: function(Type, Fn){
            if(typeof this.listeners[Type] === "undefined"){
                this.listeners[Type] = [];
            }
            if(typeof Fn === "function"){
                this.listeners[Type].push(Fn);
            }
            return this;
        },
        trigger: function(Type){
            var arrayEvent = this.listeners[Type];
            if(arrayEvent instanceof Array){
                for(var i = 0, length = arrayEvent.length; i < length; i++){
                    if(typeof arrayEvent[i] === "function"){
                        arrayEvent[i]({
                            type: Type
                        });
                    }
                }
            }
            return this;
        },
        remove: function(Type, Fn){
            var arrayEvent = this.listeners[Type];
            if(typeof Type === "string" && arrayEvent instanceof Array){
                if(typeof Fn === "function"){
                    for(var i = 0, length = arrayEvent.length; i < length; i++){
                        if(arrayEvent[i] === Fn){
                            this.listeners[Type].splice(i, 1);
                            break;
                        }
                    }
                }else{
                    delete this.listeners[Type];
                }
            }
            return this;
        }
    };
    /**
     * 判断元素A元素是否包含B元素
     *   @param  TargetElem A
     *   @param  TargetElem B
     *   @return {boolean}
     */
    MM.contains = function(ElemA, ElemB){
        if(!ElemA && !ElemB){
            return console.info("MM.contains参数故障！");
        }
        if(ElemA.contains){
            return ElemA.contains(ElemB)
        }else if(ElemA.compareDocumentPosition){
            return !!(ElemA.compareDocumentPosition(ElemB) & 16)
        }
    };
    /**
     * 获取表单全部元素 (仅 input/checkbox/radio/textarea/select等可以提交的)
     * @param formFieldId 表单容器ID
     * @returns {array}
     */
    MM.getFormElems = function(formFieldId){
        if(typeof formFieldId !== "string"){
            return console.info("MM.getFormElems参数故障！");
        }
        var elemsArr = []; //存储表单元素
        formFieldId = typeof formFieldId === "string" ? document.getElementById(formFieldId) : formFieldId;
        if(!formFieldId){
            return console.error("无法获取到 getFormElems 传递的ID参数值！");
        }
        if(formFieldId && formFieldId.nodeType == 1){
            //如果 formFieldId 元素是 form 标签
            if(formFieldId.nodeName.toLowerCase() === "form"){
                elemsArr = formFieldId.elements;
            }else{ //如果 formFieldId 元素不是 form 标签
                //获取全部 input
                var inputs = formFieldId.getElementsByTagName("INPUT");
                if(inputs && inputs.length > 0){
                    var i, leg;
                    for(i = 0, leg = inputs.length; i < leg; i++){
                        elemsArr.push(inputs[i]);
                    }
                }
                //获取全部 select
                var selects = formFieldId.getElementsByTagName("SELECT");
                if(selects && selects.length > 0){
                    var i, leg;
                    for(i = 0, leg = selects.length; i < leg; i++){
                        elemsArr.push(selects[i]);
                    }
                }
                //获取全部 textarea
                var textareas = formFieldId.getElementsByTagName("TEXTAREA");
                if(textareas && textareas.length > 0){
                    var i, leg;
                    for(i = 0, leg = textareas.length; i < leg; i++){
                        elemsArr.push(textareas[i]);
                    }
                }
                //获取全部 button
                var buttons = formFieldId.getElementsByTagName("BUTTON");
                if(buttons && buttons.length > 0){
                    var i, leg;
                    for(i = 0, leg = buttons.length; i < leg; i++){
                        elemsArr.push(buttons[i]);
                    }
                }
            }
        }
        return elemsArr;
    };
    /**
     * 获取表单全部元素的 value 值 (仅 input/checkbox/radio/textarea/select等可以提交的)
     * @param formElems 表单元素数组
     * @returns {object}
     */
    MM.getFormValues = function(formElems){
        var valuesObj = {};
        var checkboxValues = [];
        if(!formElems.length){
            return console.error("getFormValues 参数值为空！");
        }
        var i, leg;
        for(i = 0, leg = formElems.length; i < leg; i++){
            //不包含按钮
            var regStr = /button|submit|reset|image/;
            if(regStr.test(formElems[i].type) || regStr.test(formElems[i].nodeName.toLocaleLowerCase())){
                continue;
            }
            //如果是checkbox
            if(formElems[i].type === "checkbox"){
                if(formElems[i].checked){
                    checkboxValues.push(formElems[i].value);
                }else{
                    continue;
                }
                valuesObj[formElems[i].name] = checkboxValues;
                continue;
            }
            //如果是radio
            if(formElems[i].type === "radio"){
                if(formElems[i].checked){
                    valuesObj[formElems[i].name] = formElems[i].value;
                }else{
                    continue;
                }
            }
            //如果是textarea
            if(formElems[i].type === "textarea"){
                valuesObj[formElems[i].name] = formElems[i].value;
                continue;
            }
            //如果是select
            if(formElems[i].nodeName.toLocaleLowerCase() === "select"){
                valuesObj[formElems[i].name] = formElems[i].options[formElems[i].selectedIndex].value;
                continue;
            }
            //其他
            valuesObj[formElems[i].name] = formElems[i].value;
        }
        return valuesObj;
    };
    /**
     * 获取目标距离文档的Top,Left值
     * @param TargetElem 目标对象
     * @returns {top: number, left: number}
     */
    MM.getDocOffset = function(TargetElem){
        if(!TargetElem){
            return console.info("MM.getDocOffset参数故障！");
        }
        var rect = TargetElem.getBoundingClientRect(),
            body = document.body,
            docElem = document.documentElement,
            //for ie
            clientTop = docElem.clientTop || body.clientTop || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,
            zoom = 1;
        if(body.getBoundingClientRect){
            var bound = body.getBoundingClientRect();
            zoom = (bound.right - bound.left) / body.clientWidth;
        }
        if(zoom > 1){
            clientTop = 0;
            clientLeft = 0;
        }
        var top = rect.top / zoom + (window.pageYOffset || docElem && docElem.scrollTop / zoom || body.scrollTop / zoom) - clientTop,
            left = rect.left / zoom + (window.pageXOffset || docElem && docElem.scrollLeft / zoom || body.scrollLeft / zoom) - clientLeft;
        return {
            top: parseInt(top, 10),
            left: parseInt(left, 10)
        };
    };
    /**
     * 获取鼠标指针坐标值
     * @param e  事件对象
     * @returns {{x: Number, y: Number}}
     * @example
     *    MM.getMousePos(e) //返回{x: 100, y: 20}
     */
    MM.getMousePos = function(e){
        e = e || window.event;
        var ua = window.navigator.userAgent,
            browser = (function(){
                var thisFn = arguments.callee;
                //如果 thisFn.saveValue 有存储值，则返回;否则将执行 function 获取
                return thisFn.saveValue || (thisFn.saveValue = (function(){
                        //IE6、IE7、IE8、IE9、IE10
                        if(/msie/.test(ua)){
                            return ["IE", ua.match(/msie ([\d.]+)/)[1]];
                        }
                        //IE11
                        if(/rv/.test(ua) && /trident/.test(ua)){
                            return ["IE", ua.match(/rv:([\d.]+)/)[1]];
                        }
                        //Other
                        return ["Other", null];
                    }()));
            }());
        var getX = 0;
        var getY = 0;
        if(typeof(e.pageX) == "number"){
            getX = e.pageX;
            getY = e.pageY;
        }else if(browser[1] < 8){
            getX = e.clientX + document.body.scrollLeft - document.body.clientLeft;
            getY = e.clientY + document.body.scrollTop - document.body.clientTop;
        }
        return {x: parseInt(getX), y: parseInt(getY)};
    };
    /**
     * 获取浏览器窗口水平滚动条的位置
     * @returns {number}
     */
    MM.getScrollLeft = function(){
        return document.documentElement.scrollLeft || document.body.scrollLeft;
    };
    /**
     * 获取/设置浏览器窗口垂直滚动条的位置
     * @param Num 设置滚动条位置数值
     * @returns {number}
     */
    MM.rollTop = function(Num){
        if(typeof Num === 'number'){
            return document.documentElement.scrollTop ? document.documentElement.scrollTop = Num : document.body.scrollTop = Num;
        }
        return document.documentElement.scrollTop || document.body.scrollTop;
    };
    /**
     * 获取浏览器窗口的可视区域的宽高
     * @returns {object}
     */
    MM.getViewport = function(){
        return {
            width: document.documentElement.clientWidth || document.body.clientWidth,
            height: document.documentElement.clientHeight || document.body.clientHeight
        }
    };
    /**
     * 获取目标距离视口的Top,Left值
     * @param TargetElem 目标对象
     * @returns {{top: number, left: number}}
     */
    MM.getViewportOffset = function(TargetElem){
        if(!TargetElem){
            return console.info("MM.getViewportOffset参数故障！");
        }
        var offsetTop = 0,
            offsetLeft = 0;
        if(!isNaN(TargetElem.offsetTop)){
            offsetTop = TargetElem.offsetTop - MM.scrollTop();
        }
        if(!isNaN(TargetElem.offsetLeft)){
            offsetLeft = TargetElem.offsetLeft - MM.getScrollLeft();
        }
        return {
            top: offsetTop,
            left: offsetLeft
        };
    };
    /**
     * innerText
     * @param TargetElem 被操作的标签
     * @param Text 输入的文本
     * @returns {string}
     */
    MM.innerText = function(TargetElem, Text){
        if(!TargetElem && typeof Text !== "string"){
            return console.info("MM.innerText参数故障！");
        }
        if(!!Text){
            return TargetElem.textContent ? TargetElem.textContent = Text : TargetElem.innerText = Text;
        }else{
            var txt = function(Element){
                if(Element.innerText){
                    return Element.innerText;
                }else{
                    return Element.textContent;
                }
            };
            var anyString = "";
            var childs = TargetElem.childNodes;
            var i, leg = childs.length;
            for(i = 0; i < leg; i++){
                if(childs[i].nodeType == 1){
                    anyString += childs[i].tagName == "BR" ? "\n" : txt(childs[i]);
                }else if(childs[i].nodeType == 3){
                    anyString += childs[i].nodeValue;
                }
            }
            return anyString;
        }
    };
    /**
     * 获取标签的最终样式 行内/内联/外联
     * @param  TargetElem (element)字符串
     * @param  Attr 样式属性
     * @example  MM.getStyle(TargetElem) //获取标签所有属性的数组
     * @example  MM.getStyle(TargetElem, "height") //获取标签高度
     * 注：属性名称禁止使用缩写，否则火狐浏览器不识别
     */
    MM.getStyle = function(TargetElem, Attr){
        if(!TargetElem){
            return console.info("MM.getStyle参数故障！");
        }
        return window.getComputedStyle ? window.getComputedStyle(TargetElem, null).getPropertyValue(Attr) : TargetElem.currentStyle[Attr];
    };
    /**
     * 设置标签的style样式
     * @param  TargetElem (element)字符串
     * @param  Style  String或者Object
     * @example  MM.setStyle(TargetElem, "overflow:hidden;background:#ccc;");
     * @example  MM.setStyle(TargetElem, {overflow:"hidden",background:"#ccc"});
     */
    MM.setStyle = function(TargetElem, Style){
        if(!TargetElem){
            return console.info("MM.setStyle参数故障！");
        }
        if(typeof Style === "string"){
            function endsWith(Str, Suffix){
                var leg = Str.length - Suffix.length;
                return leg >= 0 && Str.indexOf(Suffix, leg) == leg;
            }

            var sty = TargetElem.style,
                cssText = sty.cssText;
            if(!endsWith(cssText, ";")){
                cssText += ";";
            }
            sty.cssText = cssText + Style;
        }
        if(Style instanceof Object){
            var attr;
            for(attr in Style){
                TargetElem.style[attr] = Style[attr];
            }
        }
    };
    /**
     * 在指定标签前插入 style
     * @param TargetElem 目标标签
     * @param StyleStr CSS样式字符串
     */
    MM.insertStyle = function(TargetElem, StyleStr){
        if(!TargetElem && typeof StyleStr !== "string"){
            return console.info("MM.insertStyle参数故障！");
        }
        var createStyle = document.createElement("style");
        if(createStyle.styleSheet){
            createStyle.styleSheet.cssText = StyleStr;
        }else{
            createStyle.appendChild(document.createTextNode(StyleStr));
        }
        TargetElem.parentNode.insertBefore(createStyle, TargetElem);
    };
    /**
     * 检测元素是否是Element(nodeType === 1)
     * @param Obj 被检测对象
     * @return {boolean}
     */
    MM.isElem = function(Element){
        var createDiv = window.document.createElement("div");
        if(Element && Element.nodeType === 1){
            if(Node && (Element instanceof Node)){
                return true;
            }
            try{
                createDiv.appendChild(Element);
                createDiv.removeChild(Element);
                createDiv = null;
            }catch(e){
                return false;
            }
            return true;
        }
        return false;
    };
    /**
     * 检测运行平台类型
     * @returns {string}
     * @example
     *     console.log(MM.isSystem); //mac
     */
    MM.isSystem = (function(){
        if(/mac/.test(_systemStr)){
            return "mac";
        }else if(/win/.test(_systemStr)){
            return "window";
        }
    })();
    /**
     * 清空全部子集或删除本身
     * @param TargetElem 全部子元素的父级标签
     * @param Flag 默认：删除全部子集，不包含自身，反之删除全部
     *【注】可以使用 ParentElem.innerHTML = "";代替
     */
    MM.empty = function(TargetElem, Flag){
        if(!TargetElem){
            return console.info("MM.remove参数故障！");
        }
        Flag = Flag || true;
        if(!Flag){
            if(TargetElem != null){
                TargetElem.parentNode.removeChild(TargetElem);
            }
        }else{
            while(TargetElem.hasChildNodes()){
                TargetElem.removeChild(TargetElem.firstChild);
            }
        }
    };
    /**
     * 删除Element
     * @param DelElem 目标的标签id
     * @returns {Element}
     */
    MM.removeNode = function(DelElem){
        if(!DelElem){
            return console.info("MM.removeNode参数故障！");
        }
        if(DelElem && DelElem.nodeName){
            DelElem.parentNode.removeChild(DelElem);
        }
        return DelElem;
    };
    /**
     * Cookie值操作方法  添加/获取/删除
     * @parem Name cookie名称
     * @parem Value cookie值
     * @param Expires cookie有效期(天)
     * @param Path cookie存储路径
     * @param Domain cookie域
     * @param Secure cookie安全(布尔值) //如果为true,那cookie值必须在https协议下才能访问
     * @return {string}
     */
    MM.cookie = {
        //名称、值、有效期(天)、路径、域、安全
        set: function(Name, Value, Expires, Path, Domain, Secure){
            var cookieText = encodeURIComponent(Name) + "=" + encodeURIComponent(Value);
            if(Expires){
                var times = new Date();
                times.setTime(times.getTime() + (Expires * 24 * 3600 * 1000));
                cookieText += "; expires=" + times.toUTCString();
            }
            if(Path){
                cookieText += "; path=" + Path;
            }
            if(Domain){
                cookieText += "; domain=" + Domain;
            }
            if(Secure){
                cookieText += "; secure";
            }
            document.cookie = cookieText;
        },
        //名称
        get: function(Name){
            var cookieArray = document.cookie.split("; ");
            for(var i = 0, leg = cookieArray.length; i < leg; i++){
                var cookieKeys = cookieArray[i].split("=");
                if(Name === decodeURIComponent(cookieKeys[0])){
                    return decodeURIComponent(cookieKeys[1]);
                }
            }
        },
        //名称、路径、域、安全
        remove: function(Name, Path, Domain, Secure){
            this.set(Name, "", new Date(0), Path, Domain, Secure);
        }
    };
    /**
     * 将HTMLCollection/NodeList/Object转换成数组
     * @param Obj 伪数组/对象
     * @return {array}
     * 用途：HTMLCollection/NodeList不具备push/pop/shift/unshift等数组方法，转换即可使用
     */
    MM.toArray = function(Obj){
        var makeArray = function(NodeList){
            return Array.prototype.slice.call(NodeList, 0);
        };
        try{
            //IE6、IE7、IE8首个节点属性是文档模型(其他是<head>)，无法使用nodeType属性，报错执行catch代码
            Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;
        }catch(e){
            makeArray = function(NodeList){
                var arr = [];
                for(var i = 0, len = NodeList.length; i < len; i++){
                    arr.push(NodeList[i]);
                }
                return arr;
            }
        }
        return makeArray(Obj);
    };
    /**
     * 判断值类型
     * @param Val 判断值
     * @return Array/String/Date/Number/RegExp/Function/Object/Boolean/undefined
     * 注：IE6下通过Object.prototype.toString.call获取的string,undefined,null均为Object，需单独处理
     */
    MM.typeof = function(Val){
        if(Val === null){
            return "null";
        }
        var valType = typeof Val;
        switch(valType){
            case "string":
                return "string";
            case "undefined":
                return "undefined";
        }
        var typeString = Object.prototype.toString.call(Val);
        switch(typeString){
            case "[object Array]":
                return "array";
            case "[object Date]":
                return "date";
            case "[object Boolean]":
                return "boolean";
            case "[object Number]":
                return "number";
            case "[object Function]":
                return "function";
            case "[object RegExp]":
                return "regexp";
            case "[object Object]":
                if(undefined !== Val.nodeType){
                    if(3 == Val.nodeType){
                        return (/\S/).test(Val.nodeValue) ? "textNode" : "whitespace";
                    }else{
                        return "element";
                    }
                }else{
                    return "object";
                }
            default:
                return "unknow";
        }
    };
    /**
     * 给网址加上时间戳,避免浏览器缓存(已经有时间戳的，会修改时间戳)
     * @param Url 网址,没有时使用所在页面的地址
     * @param TimeName 时间戳的参数名称,默认用 timeStamp
     * @example
     *      MM.addTimeStamp("http://localhost/index.html") //返回字符串： http://localhost/index.html?timeStamp=1315377347731
     *      MM.addTimeStamp("http://localhost/index.html?a=1")  //返回字符串：http://localhost/index.html?a=1&timeStamp=1315388347762
     *      MM.addTimeStamp("http://localhost/index.html?a=1", "XXX")  //返回字符串：http://localhost/index.html?a=1&XXX=1315388347762
     *      MM.addTimeStamp("http://localhost/index.html?a=1&XXX=1315388347762", "XXX")  //返回字符串：http://localhost/index.html?a=1&XXX=1466494899684
     */
    MM.addTimeStamp = function(Url, TimeName){
        Url = Url || window.location.href;
        // 时间戳的参数名称
        TimeName = TimeName || "timeStamp";
        // 判断网址是否已经有时间戳,有则替换掉旧的时间戳
        var regFlag = new RegExp("([?&])" + TimeName + "=\\d*");
        if(regFlag.test(Url)){
            return Url.replace(regFlag, RegExp.$1 + TimeName + "=" + new Date().getTime());
        }
        // 给网址增加时间戳参数
        Url += (Url.indexOf("?") > 0) ? "&" : "?";
        Url += TimeName + "=" + new Date().getTime();
        return Url;
    };
    /**
     * 哈希表(数据存储)
     * 对数据进行添加、统计、查找、替换等操作
     * @returns {{add: add, remove: remove, get: get, set: set, keys: keys, empty: empty, contains: contains, containsValue: containsValue, count: count}}
     * @example
     *     var hash = hashTable();
     *     hash.add("id", "我是add添加值id");
     *     hash.remove("id");
     */
    MM.hashTable = function(){
        // 分别保存 key 和 value
        // 原本是用 Object 来保存, 但如果 Object 被扩展了,将会影响结果,且 opera 的 Object 总是含有一个 event,最终改用数组。
        var keyArr = [],
            valueArr = [];
        // 返回一个哈希对象
        return {
            // 添加一个元素
            add: function(key, value){
                var index = keyArr.indexOf(key); //indexOf是Array添加的原型方法
                if(index === -1){ //没有此值时添加
                    keyArr.push(key);
                    valueArr.push(value);
                }else{ //有此值时修改
                    valueArr[index] = value;
                }
                //返回自身,以便连缀
                return this;
            },
            // 删除一个元素
            remove: function(key){
                var index = keyArr.indexOf(key);
                if(index > -1){
                    keyArr.remove(key); //remove是Array添加的原型方法
                    valueArr.splice(index, 1);
                }
                return this;
            },
            // 获取一个元素
            get: function(key){
                var index = keyArr.indexOf(key);
                if(index > -1){
                    return valueArr[index];
                }
                return null;
            },
            // 修改一个元素
            set: function(key, value){
                return this.add(key, value);
            },
            // 获取所有的 key
            keys: function(){
                // 返回一个复制的 key 数组,以免被外部修改
                return keyArr.clone();
            },
            // 清空
            empty: function(){
                keyArr.empty(); //empty是Array添加的原型方法
                valueArr.empty();
                return this;
            },
            // 判断是否包含此键
            contains: function(key){
                return keyArr.contains(key); //contains是Array添加的原型方法
            },
            // 判断是否包含此值
            containsValue: function(value){
                return valueArr.contains(value);
            },
            // 统计
            count: function(){
                return keyArr.length;
            }
        };
    };
    /**
     * 创建 XMLHttpRequest
     * @return XMLHttpRequest
     */
    MM.createXHR = function(){
        if(window.XMLHttpRequest){
            return new XMLHttpRequest(); //IE7+,FF,Chrome,Opera,Safari
        }else{
            return new ActiveXObject("Microsoft.XMLHTTP"); //IE6,IE5
        }
    };
    /**
     * Ajax 数据请求
     * 跨域请求 ==================================================================
     *    MM.ajax({
     *        dataType: "jsonp",
     *        url: "http://supmall.go.lemall.com/product/getSimpleSkuBySkuNo.jsonp?skuNos=409900003104",
     *        success: function(data){
     *           console.log(data);
     *        }
     *    });
     * 同域请求 ==================================================================
     *    MM.ajax({
     *        dataType: "json", //请求数据类型
     *        url : "./server.php", //需要发送的地址(默认: 当前页地址)
     *        param : {a:1, b:2}, //需要发送的传参对象
     *        async : true, //异步或者同步请求(默认: true, 异步请求)。如果需要发送同步请求，请将此选项设置为 false
     *        cache : true, //是否允许缓存请求(默认: true, 允许缓存)
     *        type : "GET", //请求方式(默认: "GET"),也可用"POST"
     *        success : function(xmlHttp){....}, //请求成功返回的动作
     *        error : function(xmlHttp, status){....}, //请求失败时的动作
     *        complete : function(xmlHttp, status){....} //请求返回后的动作(不管成败,且在 success 和 error 之后运行)
     *    });
     */
    MM.ajax = function(ParamObj){
        if(typeof ParamObj !== "object"){
            return console.info("MM.ajax参数故障！");
        }
        //需要发送的地址(默认: 当前页地址)
        ParamObj.url = ParamObj.url || "#";
        //数据类型
        ParamObj.dataType = ParamObj.dataType || "json";
        //Ajax跨域请求 =======================================================
        if(ParamObj.dataType.toLocaleUpperCase() === "JSONP"){
            var creatScript = document.createElement("script");
            //利用随机数给函数起一个函数名
            var callbackName = "JSONcallback_" + Math.random().toString().substr(2, 10);
            //给url添加callback生成的函数名
            if(/callback=\?/.test(Option.url)){
                ParamObj.url = ParamObj.url.replace(/callback=\?/, "callback=" + callbackName);
            }else{
                ParamObj.url += (ParamObj.url.indexOf("?") > 0) ? "&" : "?";
                ParamObj.url += "callback=" + callbackName;
            }
            //创建一个用callbackName作为函数名的函数
            window[callbackName] = function(data){
                ParamObj.success && ParamObj.success(data);
                window[callbackName] = null;//window清空 ,避免污染全局变量
            };
            //调用loadScript方法，生成script的标签，设置src；
            creatScript.src = ParamObj.url;
            document.getElementsByTagName("head")[0].appendChild(creatScript);
            return;
        }
        //Ajax同域请求 =======================================================
        //创建 XMLHttpRequest
        var xmlHttp = MM.createXHR();
        //如果不支持Ajax，提示信息
        if(!xmlHttp){
            alert("您的浏览器不支持Ajax，部分功能无法使用！");
            return;
        }
        //异步或者同步请求(默认: true, 异步请求)
        ParamObj.async = ParamObj.async || true;
        //缓存策略(默认: 缓存)
        if(false == ParamObj.cache){
            //ParamObj.url = MM.addTimeStamp(ParamObj.url); // 发送地址,加上时间戳,下面改用设头部信息的形式，减少对传参的影响
            xmlHttp.setRequestHeader("If-Modified-Since", "0");
            xmlHttp.setRequestHeader("Cache-Control", "no-cache");
        }
        //请求方式(默认: "GET")
        ParamObj.type = ParamObj.type || "GET";
        //GET形式，将参数放到URL上
        if("GET" == ParamObj.type.toUpperCase() && ParamObj.param){
            ParamObj.url += (ParamObj.url.indexOf("?") > 0) ? "&" : "?";
            ParamObj.url = MM.toQueryStr(ParamObj.param, ParamObj.url); //格式化url
            ParamObj.param = null;
        }
        // 发送请求
        xmlHttp.open(ParamObj.type, ParamObj.url, ParamObj.async);
        // 执行回调方法
        xmlHttp.onreadystatechange = function(){
            // XMLHttpRequest对象响应内容解析完成
            if(4 !== xmlHttp.readyState){
                return;
            }
            //状态正常时
            if(200 === xmlHttp.status){
                //请求成功时的动作
                if(ParamObj.success){
                    //ParamObj.success(JSON.parse(xmlHttp.responseText)); => IE8+
                    ParamObj.success(eval("(" + xmlHttp.responseText + ")"));
                }
            }else{
                //请求失败时的动作
                if(ParamObj.error){
                    //ParamObj.error(JSON.parse(xmlHttp), xmlHttp.status); => IE8+
                    ParamObj.error(eval("(" + xmlHttp + ")"), xmlHttp.status);
                }else{ //默认的出错处理
                    alert("页面发生Ajax错误!\n错误类型：" + xmlHttp.status + ": “" + location.pathname + "”");
                }
            }
            //请求返回后的动作(不管成败,且在 success 和 error 之后运行)
            if(ParamObj.complete){
                //ParamObj.complete(JSON.parse(xmlHttp.responseText), xmlHttp.status); => IE8+
                ParamObj.complete(eval("(" + xmlHttp.responseText + ")"), xmlHttp.status);
            }
        };
        // 请求方式("POST")
        if(ParamObj.type.toUpperCase() === "POST"){
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
            //格式化param
            ParamObj.param = MM.toQueryStr(ParamObj.param);
        }
        // 发送参数
        xmlHttp.send(ParamObj.param);
        return this;
    };
    /**
     * 分解URL请求参数
     *   @param Href 网址；没有参数时默认使用所在网页的网址
     *   @param Key2lowerCase 是否需要将key转成小写,为true则转成小写，否则不转(默认不干涉)
     *   @return {object} //返回json形式的参数内容
     *   @example MM.getRequestParams("http://localhost/index.html?d2d=哈哈&dd=oo111") // 返回对象: {d2d:"哈哈", dd:"oo111"}
     */
    MM.getRequestParams = function(Href, Key2lowerCase){
        Href = Href || window.location.href;
        var result = {};
        var regex = /(\w+)=([^&]+)/gi;
        var ms = Href.match(regex);
        if(ms == null){
            return result;
        }
        var i, leg;
        for(i = 0, leg = ms.length; i < leg; i++){
            var ns = ms[i].match(regex);
            var key = RegExp.$1;
            key = Key2lowerCase ? ("" + key).toLowerCase() : key;
            try{
                result[key] = decodeURIComponent(RegExp.$2);
            }catch(e){
            }
        }
        return result;
    };
    /**
     * 将对象格式化成 URL 的参数形式
     *   @param Obj 需要转成参数的对象
     *   @param Href 网址; 没有网址则只返回格式化后的参数部分,有网址则拼接到网址上(还会修改网址上原有的值)
     *   @param Key2lowerCase 是否需要将key转成小写,为true则转成小写，否则不转(默认不干涉)
     *   @return {string} //返回编码后的字符串
     *   @example
     *   MM.toQueryStr({d2d:"CCC", b:"DDD"}, "http://localhost/index.html?d2d=AAA&dd=BBB") //返回:"http://localhost/index.html?d2d=CCC&dd=BBB&b=DDD"
     *   MM.toQueryStr({d2d:"哈哈", b:2}) // 返回: "d2d=%E5%93%88%E5%93%88&b=2"
     */
    MM.toQueryStr = function(Obj, Href, Key2lowerCase){
        if(!Href || typeof Href != "string"){
            Href = "";
        }else{ //把网址上的参数拼接到 Obj 类里面
            if(!Obj || typeof Obj != "object"){
                Obj = MM.getRequestParams(Href, Key2lowerCase);
            }else{
                Obj = MM.extend(MM.getRequestParams(Href, Key2lowerCase), Obj);
            }
        }
        // 截取出网址(去掉参数部分)
        var index = Href.indexOf("?");
        if(index > 0){
            Href = Href.substring(0, index) + "?";
        }
        var parts = [];
        for(var key in Obj){
            key = Key2lowerCase ? ("" + key).toLowerCase() : key;
            parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(Obj[key]));
        }
        Href += parts.join("&");
        return Href;
    };
    /**
     * 类的扩展
     *   @param Destination 被扩展的类
     *   @param Source 要扩展的内容
     *   @return {object} //扩展后的类(可以不接收参数,原被扩展的类会被修改而引用不变)
     *   @example
     *      var a = new Object();
     *      MM.extend(a, {
     *          alertStr: function(str){alert(str);}
     *      });
     *      a.alertStr("要提示的内容"); // 调用
     */
    MM.extend = function(Destination, Source){
        for(var key in Source){
            if(Source.hasOwnProperty(key)){
                Destination[key] = Source[key];
            }
        }
        return Destination;
    };
    // Only CSS3  ==========================================================================================================
    /**
     * 兼容事件字符串 transitionEnd animationStart animationEnd
     */
    MM.animEventStr = function(EventStr){
        if(typeof EventStr !== "string"){
            return console.info("MM.animEventStr参数故障！");
        }
        return (function(){
            var createElem = window.document.createElement("div"),
                style = createElem.style;
            var eventNames = {
                transitionEnd: {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd",
                    transition: "transitionend"
                },
                animationStart: {
                    WebkitAnimation: "webkitAnimationStart",
                    animation: "animationstart"
                },
                animationEnd: {
                    WebkitAnimation: "webkitAnimationEnd",
                    animation: "animationend"
                }
            };
            for(var name in eventNames[EventStr]){
                if(typeof style[name] === "string"){
                    return eventNames[EventStr][name];
                }
            }
        }());
    };
    /**
     * CSS3私有样式处理工具
     * @param TargetElem 目标标签
     * @param StyleObj Object(写入)或String(获取)
     * @param CallBack 回调函数
     * @emample
     *     //写入
     *     MM.animCss3(box, {
     *         transitionProperty: "transform",
     *         transitionDuration: "2s",
     *         transitionTimingFunction: "cubic-bezier(0.250, 0.250, 0.750, 0.750)",
     *         transitionDelay: "1s",
     *         transform: "translate(10px, 50px)",
     *         transformOrigin: "10px 20px 0",
     *         filter: "blur(30px)"
     *    });
     *    //获取
     *    console.log(MM.animCss3(box, "transitionProperty"));
     *    console.log(MM.animCss3(box, "transitionDuration"));
     *    console.log(MM.animCss3(box, "transitionTimingFunction"));
     *    console.log(MM.animCss3(box, "transitionDelay"));
     *    console.log(MM.animCss3(box, "transform"));
     *    console.log(MM.animCss3(box, "transformOrigin"));
     *    console.log(MM.animCss3(box, "filter"));
     */
    MM.attrCss3 = function(TargetElem, StyleObj, CallBack){
        if(!TargetElem){
            return console.info("MM.attrCss3参数故障！");
        }
        var newDiv = document.createElement("div");
        //速率 //借鉴使用，内部并无调用
        var cssEase = {
            "ease": "ease",
            "easeIn": "ease-in",
            "easeOut": "ease-out",
            "easeInOut": "ease-in-out",
            "snap": "cubic-bezier(0,1,.5,1)",
            "linear": "cubic-bezier(.250, .250, .750, .750)",
            //Penner Equations
            "easeInCubic": "cubic-bezier(.550,.055,.675,.190)",
            "easeOutCubic": "cubic-bezier(.215,.61,.355,1)",
            "easeInOutCubic": "cubic-bezier(.645,.045,.355,1)",
            "easeInCirc": "cubic-bezier(.6,.04,.98,.335)",
            "easeOutCirc": "cubic-bezier(.075,.82,.165,1)",
            "easeInOutCirc": "cubic-bezier(.785,.135,.15,.86)",
            "easeInExpo": "cubic-bezier(.95,.05,.795,.035)",
            "easeOutExpo": "cubic-bezier(.19,1,.22,1)",
            "easeInOutExpo": "cubic-bezier(1,0,0,1)",
            "easeInQuad": "cubic-bezier(.55,.085,.68,.53)",
            "easeOutQuad": "cubic-bezier(.25,.46,.45,.94)",
            "easeInOutQuad": "cubic-bezier(.455,.03,.515,.955)",
            "easeInQuart": "cubic-bezier(.895,.03,.685,.22)",
            "easeOutQuart": "cubic-bezier(.165,.84,.44,1)",
            "easeInOutQuart": "cubic-bezier(.77,0,.175,1)",
            "easeInQuint": "cubic-bezier(.755,.05,.855,.06)",
            "easeOutQuint": "cubic-bezier(.23,1,.32,1)",
            "easeInOutQuint": "cubic-bezier(.86,0,.07,1)",
            "easeInSine": "cubic-bezier(.47,0,.745,.715)",
            "easeOutSine": "cubic-bezier(.39,.575,.565,1)",
            "easeInOutSine": "cubic-bezier(.445,.05,.55,.95)",
            "easeInBack": "cubic-bezier(.6,-.28,.735,.045)",
            "easeOutBack": "cubic-bezier(.175, .885,.32,1.275)",
            "easeInOutBack": "cubic-bezier(.68,-.55,.265,1.55)"
        };
        //适配各浏览器CSS3私有属性名称
        var fitAttrName = function(attrName){
            if(attrName in newDiv.style){
                return attrName;
            }
            var prefixes = ["Moz", "Webkit", "O", "ms"];
            var noramlProp = attrName.charAt(0).toLocaleUpperCase() + attrName.substr(1);
            for(var i = 0; i < prefixes.length; ++i){
                var vendorProp = prefixes[i] + noramlProp;
                if(vendorProp in newDiv.style){
                    return vendorProp;
                }
            }
        };
        //经过适配的CSS3私有属性名称
        var support = {
            transition: fitAttrName("transition"),
            transitionProperty: fitAttrName("transitionProperty"),
            transitionDuration: fitAttrName("transitionDuration"),
            transitionTimingFunction: fitAttrName("transitionTimingFunction"),
            transitionDelay: fitAttrName("transitionDelay"),
            transform: fitAttrName("transform"),
            transformOrigin: fitAttrName("transformOrigin"),
            filter: (function(){
                return /chrome/.test(window.navigator.userAgent.toLowerCase()) ? "webkitFilter" : "filter";
            }())
        };
        var eventNames = {
            "transition": "transitionend",
            "MozTransition": "transitionend",
            "OTransition": "oTransitionEnd",
            "WebkitTransition": "webkitTransitionEnd",
            "msTransition": "MSTransitionEnd"
        };
        //Transition动画结束监听
        var transitionEnd = eventNames[support.transition] || null;
        bind(TargetElem, transitionEnd, function(){
            TargetElem.style[support.transition] = "";
            if(!!CallBack){
                CallBack();
            }
        });
        //样式写入
        if(StyleObj instanceof Object){
            for(var attr in StyleObj){
                if(StyleObj.hasOwnProperty(attr)){
                    if(attr === "filter"){
                        TargetElem.style[support.filter] = StyleObj[attr];
                    }else{
                        var newAttr = fitAttrName(attr);
                        TargetElem.style[newAttr] = StyleObj[attr];
                    }
                }
            }
        }
        //样式获取
        if(typeof StyleObj === "string"){
            return window.getComputedStyle(TargetElem, null)[support[StyleObj]];
        }
        //事件监听Fn
        function bind(TargetElem, Type, Fn){
            return TargetElem.addEventListener ? TargetElem.addEventListener(Type, Fn, false) : TargetElem.attachEvent("on" + Type, Fn);
        }

        //避免IE内存泄露
        newDiv = null;
    };
    // String ==============================================================================================================
    /**
     * 去除字符串的前后空格
     * @param Str 目标字符串
     * @returns {string}
     * @example
     *     MM.strTrim(" dd dd "); //"dd dd"
     */
    MM.strTrim = function(Str){
        if(!Str && typeof Str !== "string"){
            return console.info("MM.strTrim参数故障！");
        }
        return Str.replace(new RegExp("(^(\\s* *)*)|((\\s* *)*$)", "g"), "");
    };
    /**
     * 检查字符串是否只由数字(Number)、字母(Letter)组成
     * @param Str 目标字符串
     * @returns {boolean} (空字符串返回 false)
     */
    MM.strIsNL = function(Str){
        if(!Str && typeof Str !== "string"){
            return console.info("MM.strIsNL参数故障！");
        }
        return new RegExp("^[A-Za-z0-9]+$", "g").test(Str);
    };
    /**
     * 检查字符串是否只由数字(Number)、字母(Letter)或者下划线(_)组成
     * @param Str 目标字符串
     * @returns {boolean}
     */
    MM.strIs_NL = function(Str){
        if(!Str && typeof Str !== "string"){
            return console.info("MM.strIs_NL参数故障！");
        }
        return new RegExp("^\\w+$", "g").test(Str);
    };
    /**
     * 检查字符串是否只由汉字(Chinese)、字母(Number)、数字(Letter)组成
     * @param Str 目标字符串
     * @returns {boolean}
     */
    MM.strIsCNL = function(Str){
        if(!Str && typeof Str !== "string"){
            return console.info("MM.strIsCNL参数故障！");
        }
        return new RegExp("^[0-9a-zA-Z\u4e00-\u9fa5]+$").test(Str);
    };
    /**
     * 检查字符串是否为email地址
     * @param Str 目标字符串
     * @return boolean (空字符串返回 false)
     */
    MM.strIsEmail = function(Str){
        if(!Str && typeof Str !== "string"){
            return console.info("MM.strIsEmail参数故障！");
        }
        return new RegExp("^[a-z0-9][a-z0-9\\-_.]*[a-z0-9]+@(([a-z0-9]([a-z0-9]*[-_]?[a-z0-9]+)+\\.[a-z0-9]+(\\.[a-z0-9]+)?)|(([1-9]|([1-9]\\d)|(1\\d\\d)|(2([0-4]\\d|5[0-5])))\\.(([\\d]|([1-9]\\d)|(1\\d\\d)|(2([0-4]\\d|5[0-5])))\\.){2}([1-9]|([1-9]\\d)|(1\\d\\d)|(2([0-4]\\d|5[0-5])))))$", "gi").test(MM.strTrim(Str));
    };
    /**
     * 检查字符串是否为URL地址
     * @return boolean 符合返回true,否则返回false (注:空字符串返回 false)
     */
    MM.strIsUrl = function(Str){
        if(!Str && typeof Str !== "string"){
            return console.info("MM.strIsUrl参数故障！");
        }
        var reg = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return reg.test(Str);
    };
    // Array ===============================================================================================================
    /**
     * 去除数组中的空、null、undefined
     * @param Arr
     * @returns {array}
     */
    MM.arrTrim = function(Arr){
        for(var i = 0, leg = Arr.length; i < leg; i++){
            if(!Arr[i]){
                Arr.splice(i, 1);
                leg--;
                i--;
            }
        }
        return Arr;
    };
    /**  遍历数组
     *   @param Arr 被操作的数组
     *   @param Fn(Val, Index) Val:数组值 Index:数组序列号
     *   @returns {*}
     *      var arr = [1, 2, 3];
     *      MM.arrForEach(arr, function(Val, Index){
     *          console.log(Val + ":" + Index); //会把数组逐个值打印处理
     *      });
     */
    MM.arrEach = function(Arr, Fn){
        if(typeof Fn === "function"){
            var i, leg;
            for(i = 0, leg = Arr.length; i < leg; i++){
                Fn.call(Arr, Arr[i], i);
            }
            return Arr;
        }
    };
    /**  遍历数组
     *   @param Arr 被操作的数组
     *   @param Fn
     *   @returns {Array} 返回数组由所有函数返回值组成
     *   @example
     *      var users = [
     *          {name: "张含韵", "email": "zhang@email.com"},
     *          {name: "江一燕", "email": "jiang@email.com"},
     *          {name: "李小璐", "email": "li@email.com"}
     *       ];
     *      var emails = MM.arrMap(users, function(Val, Index){return Index + ":" + Val.email;});
     *      console.log(emails)
     */
    MM.arrMap = function(Arr, Fn){
        var arr = [];
        if(typeof Fn === "function"){
            var i, leg;
            for(i = 0, leg = Arr.length; i < leg; i++){
                arr.push(Fn.call(Arr, Arr[i], i));
            }
        }
        return arr;
    };
}(window));