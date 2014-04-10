/**
 * [模拟滚动条]
 * @author otarim
 */
(function(w, d, undefined) {
    function iScroll() {
        var CONFIG = [].shift.call(arguments);
        this.el = CONFIG["el"];
        this.direction = CONFIG["direction"] || "top";
        this.scrollBar = CONFIG["scrollBar"];
        this.scrollTo = CONFIG["scrollTo"] || 0;
        this.prevBtn = CONFIG["prevBtn"];
        this.nextBtn = CONFIG["nextBtn"];
        this.speed = CONFIG["speed"] || 10;
        this.barSpeed = 0;
        this.autoScroll = CONFIG["autoScroll"];
        this.focus = CONFIG["focus"];
        this.smoothMode = CONFIG["smoothMode"];
        this.init = CONFIG["init"];
        this.ajaxBtn = CONFIG["ajaxBtn"];
        this.done = CONFIG["done"];
        /**
         * [_callbackLock_回调锁，滚动每次回调都只能触发一次，连接关闭之后重置锁状态]
         * @type {Boolean}
         */
        this._callbackLock_ = true;
        /**
         * [cache 鼠标交互以及滚动前后的缓存，包括滚动条的最后高度以及文档的最后高度]
         * @type {Object}
         */
        this.cache = {
            els_pos:0,
            sb_pos:0,
            ms_pos:0,
            ms_lastpos:0
        };
        /**
         * [CriticalBar 临界处理]
         * @type {Object}
         */
        this.CriticalBar = {
            low:0,
            high:0
        };
        this.CriticalEl = {
            low:0,
            high:0
        };
        this.initialize();
    }
    iScroll.prototype = {
        initialize:function() {
            if (this.focus && !iScroll.isMobile) {
                this.barFocus();
            }
            if (this.prevBtn || this.nextBtn) {
                this.doBtnEvent();
            }
            if (this.autoScroll) {}
            if (this.resize) {
                this.resizeBar();
            }
            if (this.done) {
                this.done.timmer = null;
                /**
                 * [activeType 回调函数done的触发方式]
                 * @type {0: 点击触发;1: 滚动触发}
                 */
                if (this.ajaxBtn) {
                    var self = this;
                    this.activeType = 0;
                    /**
                     * 绑定回调函数
                     */
                    iScroll.addEvent(this.ajaxBtn, "click", function(e) {
                        self.doneCallback(self.done);
                        e.preventDefault ? e.preventDefault() :e.returnValue = false;
                    });
                } else {
                    this.activeType = 1;
                }
            }
            // 初始化滚动条大小
            this.initScrollBar();
            this.bind();
        },
        mousewheel:function(callback) {
            var self = this;
            if ("onmousewheel" in this.el) {
                this.el.onmousewheel = function(e) {
                    var e = e || w.event;
                    e._detail = e.wheelDelta / 120;
                    callback.call(self, e);
                };
            } else {
                this.el.addEventListener("DOMMouseScroll", function(e) {
                    var e = e || w.event;
                    e._detail = -(e.detail || 0) / 3;
                    callback.call(self, e);
                }, false);
            }
        },
        initScrollBar:function() {
            this.buildBar();
            /**
             * 初始化滚动条拖动事件
             */
            if (!iScroll.isMobile) {
                this.initDrag();
            }
            if (this.scrollTo) {
                this.doScrollto();
            }
        },
        buildBar:function() {
            var el_parent = this.el.parentNode, ep_style = el_parent.style;
            if (iScroll.getStyle(el_parent, "display") === "none") {
                el_parent.tmpStyle = ep_style.cssText;
                ep_style.cssText += ";position: absolute;visibility:hidden;display:block;";
            }
            /**
             * 修复滤镜在ie8下的问题，ie8以上浏览器未定义zindex返回"" ie8以下返回0，滚回低版本ie
             */
            navigator.userAgent.indexOf("MSIE 8.0") !== -1 && !iScroll.getStyle(this.scrollBar.parentNode, "z-index") && (this.scrollBar.parentNode.style.zIndex = 0);
            /**
             * 初始化滚动条
             */
            var initOffset = this.direction === "top" ? "offsetHeight" :"offsetWidth", sb_style = this.scrollBar.style;
            if (this.prevBtn) {
                sb_style[this.direction] = (this.CriticalBar.low = this.prevBtn[initOffset]) + "px";
            } else {
                sb_style[this.direction] = 0;
            }
            this.elHeight = this.direction === "top" ? this.el.scrollHeight :this.el.scrollWidth;
            var sbOffset = this.direction === "top" ? "height" :"width", eloffsetHeight = this.el[initOffset];
            var compareOffset = this.scrollBar.parentNode[initOffset] - (this.prevBtn ? this.prevBtn[initOffset] :0) - (this.nextBtn ? this.nextBtn[initOffset] :0);
            this.cache.sb_pos = Math.floor(this.cache.els_pos * compareOffset / this.elHeight) + this.CriticalBar.low;
            sb_style[this.direction] = this.cache.sb_pos + "px";
            /**
             * [滚动条自身高度]
             * @type {[type]}
             */
            sb_style[sbOffset] = Math.floor(eloffsetHeight * compareOffset / this.elHeight) + "px";
            this.CriticalBar.high = compareOffset - parseInt(sb_style[sbOffset], 10) + this.CriticalBar.low;
            /**
             * [滚动条速度]
             * @type {[type]}
             */
            this.barSpeed = (compareOffset - this.scrollBar[initOffset]) * this.speed / (this.CriticalEl.high = this.elHeight - eloffsetHeight, 
            this.CriticalEl.high) || 0;
            typeof el_parent.tmpStyle !== "undefined" && (ep_style.cssText = el_parent.tmpStyle, 
            el_parent.tmpStyle = undefined);
        },
        initDrag:function() {
            var isActive = false, scrollBar = this.scrollBar, __cache__ = this.cache, direction = this.direction === "top" ? "scrollTop" :"scrollLeft", msToken = this.direction === "top" ? "clientY" :"clientX", el = this.el, parent = el.parentNode, sb_style = this.scrollBar.style, self = this;
            scrollBar.onmousedown = function(e) {
                var e = e || w.event;
                __cache__.ms_pos = e[msToken];
                isActive = true;
                parent.mouseout && (iScroll.detachEvent(parent, "mouseover", parent.mouseover), 
                iScroll.detachEvent(parent, "mouseout", parent.mouseout));
                d.onselectstart = function() {
                    return false;
                };
                d.onmousemove = function(e) {
                    var e = e || w.event;
                    if (isActive) {
                        __cache__.ms_lastpos = e[msToken];
                        var ms_offset = __cache__.ms_lastpos - __cache__.ms_pos, sb_offsetValue = __cache__.sb_pos + ms_offset, offsetValue;
                        sb_offsetValue < self.CriticalBar.low && (sb_offsetValue = self.CriticalBar.low);
                        sb_offsetValue >= self.CriticalBar.high && (sb_offsetValue = self.CriticalBar.high);
                        offsetValue = ms_offset * self.speed / self.barSpeed;
                        el[direction] = __cache__.els_pos + offsetValue;
                        sb_style[self.direction] = sb_offsetValue + "px";
                    }
                    e.preventDefault ? e.preventDefault() :e.returnValue = false;
                };
                d.onmouseup = function() {
                    isActive = false;
                    __cache__.els_pos = el[direction];
                    __cache__.sb_pos = parseInt(sb_style[self.direction], 10);
                    try {
                        d.onselectstart = d.onmouseup = d.onmousemove = undefined;
                    } catch (e) {}
                    parent.mouseout && (iScroll.addEvent(parent, "mouseover", parent.mouseover), iScroll.addEvent(parent, "mouseout", parent.mouseout));
                    __cache__.els_pos === self.CriticalEl.high && self.done && self.activeType && self.doneCallback(self.done);
                };
            };
        },
        bind:function() {
            var direction = this.direction === "top" ? "scrollTop" :"scrollLeft";
            if (iScroll.isMobile) {
                var isActive = false, scrollBar = this.scrollBar, __cache__ = this.cache, msToken = this.direction === "top" ? "pageY" :"pageX", el = this.el, parent = el.parentNode, sb_style = this.scrollBar.style, self = this;
                this.el.addEventListener("touchstart", function(e) {
                    __cache__.ms_pos = e["touches"][0][msToken];
                    isActive = true;
                    d.onselectstart = function() {
                        return false;
                    };
                    function _touchmove(e) {
                        if (isActive) {
                            __cache__.ms_lastpos = e["touches"][0][msToken];
                            var ms_offset = __cache__.ms_pos - __cache__.ms_lastpos, sb_offsetValue = __cache__.sb_pos + ms_offset, offsetValue;
                            sb_offsetValue < self.CriticalBar.low && (sb_offsetValue = self.CriticalBar.low);
                            sb_offsetValue >= self.CriticalBar.high && (sb_offsetValue = self.CriticalBar.high);
                            offsetValue = ms_offset * self.speed / self.barSpeed;
                            el[direction] = __cache__.els_pos + offsetValue;
                            sb_style[self.direction] = sb_offsetValue + "px";
                        }
                        e.preventDefault();
                    }
                    function _touchend() {
                        isActive = false;
                        __cache__.els_pos = el[direction];
                        __cache__.sb_pos = parseInt(sb_style[self.direction], 10);
                        try {
                            d.onselectstart = undefined;
                            self.el.removeEventListener("touchmove", _touchmove, false);
                            self.el.removeEventListener("touchend", _touchend, false);
                        } catch (e) {}
                        __cache__.els_pos === self.CriticalEl.high && self.done && self.activeType && self.doneCallback(self.done);
                    }
                    self.el.addEventListener("touchmove", _touchmove, false);
                    self.el.addEventListener("touchend", _touchend, false);
                }, false);
            } else {
                this.mousewheel(function(e) {
                    if (e._detail < 0) {
                        this.process({
                            barSpeed:this.barSpeed,
                            speed:this.speed,
                            direction:direction
                        });
                    } else if (e._detail > 0) {
                        this.process({
                            barSpeed:-this.barSpeed,
                            speed:-this.speed,
                            direction:direction
                        });
                    }
                });
                /**
                 * 鼠标移动到可滚动元素上面的时候，取消桌面的滚动事件
                 */
                this.unbindDocumentEvent();
            }
            this.init && this.init();
        },
        unbindDocumentEvent:function() {
            var self = this;
            iScroll.addEvent(this.el, "mouseover", function(e) {
                var e_target = e.relateTarget || e.fromElement;
                if (iScroll.isContains(self.el, e_target)) return;
                if ("onmousewheel" in self.el) {
                    d.onmousewheel = function() {
                        return false;
                    };
                } else {
                    d.tmpDOMMouseScroll = function(e) {
                        e.preventDefault();
                    };
                    d.addEventListener("DOMMouseScroll", d.tmpDOMMouseScroll, false);
                }
            });
            iScroll.addEvent(this.el, "mouseout", function(e) {
                var e_target = e.relateTarget || e.toElement;
                if (iScroll.isContains(self.el, e_target)) return;
                if ("onmousewheel" in self.el) {
                    d.onmousewheel = null;
                } else {
                    d.removeEventListener("DOMMouseScroll", d.tmpDOMMouseScroll, false);
                }
            });
        },
        doScrollto:function() {
            /**
             * 重新定位文档以及滚动条的坐标 依赖初始化滚动条
             */
            if (this.scrollTo > this.CriticalEl.high || this.scrollTo < this.CriticalEl.low) {
                return;
            }
            var direction = this.direction === "top" ? "scrollTop" :"scrollLeft";
            this.cache.els_pos = this.el[direction] = this.scrollTo;
            this.scrollBar.style[this.direction] = (this.cache.sb_pos += this.scrollTo / this.speed * this.barSpeed) + "px";
        },
        doAutoScroll:function() {},
        doBtnEvent:function() {
            var self = this, el = self.el, timmer;
            var direction = this.direction === "top" ? "scrollTop" :"scrollLeft";
            function mouseCallback(e, type) {
                var tmpSpeed, barSpeed, step;
                type === 1 ? (tmpSpeed = self.speed, barSpeed = self.barSpeed, step = 1) :(tmpSpeed = -self.speed, 
                barSpeed = -self.barSpeed, step = -1);
                (function() {
                    self.process({
                        direction:direction,
                        speed:tmpSpeed,
                        barSpeed:barSpeed
                    });
                    // tmpSpeed += step;
                    // barSpeed += step;
                    timmer = w.requestAnimationFrame(arguments.callee);
                })();
            }
            if(iScroll.isMobile){
                this.nextBtn.addEventListener('touchstart',function(e){
                    mouseCallback(e, 1);
                    e.preventDefault();
                })
                this.nextBtn.addEventListener('touchend',function(e){
                    w.cancelAnimationFrame(timmer);
                })
                this.prevBtn.addEventListener('touchstart',function(e){
                    mouseCallback(e, -1);
                    e.preventDefault();
                })
                this.prevBtn.addEventListener('touchend',function(e){
                    w.cancelAnimationFrame(timmer);
                })
            }else{
                this.nextBtn.onmousedown = function(e) {
                    var e = e || w.event;
                    mouseCallback(e, 1);
                    e.preventDefault ? e.preventDefault() :e.returnValue = false;
                };
                this.prevBtn.onmousedown = function(e) {
                    var e = e || w.event;
                    mouseCallback(e, -1);
                    e.preventDefault ? e.preventDefault() :e.returnValue = false;
                };
                this.nextBtn.onmouseup = this.prevBtn.onmouseup = function() {
                    w.cancelAnimationFrame(timmer);
                }; 
            }        
        },
        barFocus:function() {
            var self = this, sBar = this.scrollBar.parentNode.style, parent = this.el.parentNode, timmer;
            // fix ie haslayout issue
            sBar.zoom = 1;
            var mouseCallback = function(e, target) {
                var e = w.event || e;
                var e_target = e.relatedTarget || e[target];
                if (iScroll.isContains(parent, e_target)) return;
                target === "fromElement" ? doAnimate(0, 1) :doAnimate(1, 0);
            };
            parent.mouseover = function(e) {
                mouseCallback(e, "fromElement");
            };
            parent.mouseout = function(e) {
                mouseCallback(e, "toElement");
            };
            function doAnimate(start, end) {
                var step = (end - start) / 16;
                (function() {
                    sBar.opacity = start;
                    sBar.filter = "alpha(opacity=" + Math.floor(start * 100) + ")";
                    if (start === end) {
                        // sBar.opacity = end;
                        // sBar.filter = 'Alpha(opacity='+Math.floor(end*100)+')';
                        // sBar.removeAttribute('filter');
                        // fix cleartype issue
                        if (start >= 1 && sBar.removeAttribute) sBar.removeAttribute("filter");
                        w.cancelAnimationFrame(timmer);
                    } else {
                        start += step;
                        timmer = w.requestAnimationFrame(arguments.callee);
                    }
                })();
            }
            iScroll.addEvent(parent, "mouseover", parent.mouseover);
            iScroll.addEvent(parent, "mouseout", parent.mouseout);
        },
        /**
         * [process 处理滚动条以及文档的位置统一入口]
         * @return {[type]} [description]
         */
        process:function(obj) {
            var direction = obj.direction, el = this.el, self = this, sb_style = this.scrollBar.style, __cache__ = this.cache, timmer;
            __cache__.sb_pos += obj.barSpeed || this.barSpeed;
            __cache__.sb_pos >= this.CriticalBar.high && (__cache__.sb_pos = this.CriticalBar.high, 
            __cache__.els_pos = this.CriticalEl.high) && this.done && this.activeType && this.doneCallback(this.done);
            __cache__.sb_pos < this.CriticalBar.low && (__cache__.sb_pos = this.CriticalBar.low, 
            __cache__.els_pos = this.CriticalEl.low);
            el[direction] = __cache__.els_pos += obj.speed;
            sb_style[this.direction] = __cache__.sb_pos + "px";
        },
        doneCallback:function(done) {
            var self = this;
            clearTimeout(done.timmer);
            done.timmer = setTimeout(function() {
                done.call(self);
            }, 50);
        },
        ajax:function(config) {
            var self = this;
            if (self._callbackLock_) {
                self._callbackLock_ = false;
                if (config.type === "jsonp") {
                    /**
                 * jsonp的实现方式
                 **/
                    var script = d.createElement("script"), callbackName = config.callbackName ? config.callbackName :"iScroll" + encodeURIComponent(location.href).replace(/[^\w\s]/g, "");
                    w[callbackName] = function(data) {
                        script.jsonp = 1;
                        // 成功完成的时候执行回调函数onsuccse
                        // 回调会在onload之前执行
                        // onload之后的是判断是否有jsonp的token，有的话清除script标签，没有的话，说明没有经过回调函数这一步，执行error函数
                        config.onsuccse && config.onsuccse.call(self, data);
                        self._callbackLock_ = true;
                        self.buildBar();
                    };
                    if (script.readyState) {
                        script.onreadystatechange = function() {
                            if (/loaded|complete/i.test(script.readyState)) {
                                errorCallback();
                            } else if (script.readyState === "loading") {
                                config.onprocess && config.onprocess.call(self);
                            }
                        };
                    } else {
                        script.onload = script.onerror = function() {
                            errorCallback();
                        };
                    }
                    function errorCallback() {
                        if (typeof script.jsonp === "undefined") {
                            config.onerror && config.onerror.call(self);
                        }
                        if (script.clearAttributes) {
                            script.clearAttributes();
                        } else {
                            script.onload = script.onreadystatechange = script.onerror = null;
                        }
                        script.parentNode.removeChild(script);
                        self._callbackLock_ = true;
                    }
                    script.src = config.url + (config.url.indexOf("?") !== -1 ? "&callback=" :"?callback=") + callbackName;
                    d.getElementsByTagName("head")[0].appendChild(script);
                } else {
                    /**
                 * 传统ajax的实现
                 **/
                    var xhr = w.XMLHttpRequest ? new XMLHttpRequest() :new ActiveXObject("Microsoft.XMLHTTP"), responseType = config.dataType === "text/plain" || typeof config.dataType === "undefined" ? "responseText" :config.dataType === "text/xml" && "responseXML";
                    xhr.open(config.type ? config.type :"get", config.url, true);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                                config.onsuccse && config.onsuccse.call(self, xhr[responseType]);
                                self.buildBar();
                            } else {
                                config.onerror && config.onerror.call(self, xhr.statusText);
                            }
                            /*重置回调锁*/
                            self._callbackLock_ = true;
                        } else if (xhr.readyState === 3) {
                            config.onprocess && config.onprocess.call(self);
                        }
                    };
                    config.type === "post" && xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
                    xhr.send(null);
                }
            }
        }
    };
    iScroll.addEvent = function(obj, event, callback) {
        if (typeof addEventListener === "function") {
            return obj.addEventListener(event, callback, false);
        } else {
            return obj.attachEvent("on" + event, callback);
        }
    };
    iScroll.detachEvent = function(obj, event, callback) {
        if (typeof removeEventListener === "function") {
            return obj.removeEventListener(event, callback, false);
        } else {
            return obj.detachEvent("on" + event, callback);
        }
    };
    iScroll.isContains = function(a, b) {
        return a.contains ? a.contains(b) :a.compareDocumentPosition(b) == 16;
    };
    iScroll.getStyle = function(elem, property) {
        return elem.style[property] ? elem.style[property] :elem.currentStyle ? elem.currentStyle[property] :window.getComputedStyle(elem, null)[property];
    };
    iScroll.isMobile = "ontouchend" in d ? true :false;
    w.requestAnimationFrame = w.requestAnimationFrame || w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.oRequestAnimationFrame || function(callback) {
        return setTimeout(callback, 1e3 / 60);
    };
    w.cancelAnimationFrame = w.cancelAnimationFrame || w.mozCancelAnimationFrame || w.webkitCancelAnimationFrame || w.msCancelAnimationFrame || w.oCancelAnimationFrame || function(callback) {
        return clearTimeout(callback, 1e3 / 60);
    };
    var _iScroll = {
        init:function(config) {
            return new iScroll(config);
        }
    };
    w.iScroll = _iScroll;
})(window, document);