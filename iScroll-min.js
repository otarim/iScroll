!function(a,b,c){function d(){var a=[].shift.call(arguments);this.el=a.el,this.direction=a.direction||"top",this.scrollBar=a.scrollBar,this.scrollTo=a.scrollTo||0,this.prevBtn=a.prevBtn,this.nextBtn=a.nextBtn,this.speed=a.speed||10,this.barSpeed=0,this.autoScroll=a.autoScroll,this.focus=a.focus,this.smoothMode=a.smoothMode,this.init=a.init,this.ajaxBtn=a.ajaxBtn,this.done=a.done,this._callbackLock_=!0,this.cache={els_pos:0,sb_pos:0,ms_pos:0,ms_lastpos:0},this.CriticalBar={low:0,high:0},this.CriticalEl={low:0,high:0},this.initialize()}d.prototype={initialize:function(){if(this.focus&&!d.isMobile&&this.barFocus(),(this.prevBtn||this.nextBtn)&&this.doBtnEvent(),this.autoScroll,this.resize&&this.resizeBar(),this.done)if(this.done.timmer=null,this.ajaxBtn){var a=this;this.activeType=0,d.addEvent(this.ajaxBtn,"click",function(b){a.doneCallback(a.done),b.preventDefault?b.preventDefault():b.returnValue=!1})}else this.activeType=1;this.initScrollBar(),this.bind()},mousewheel:function(b){var c=this;"onmousewheel"in this.el?this.el.onmousewheel=function(d){var d=d||a.event;d._detail=d.wheelDelta/120,b.call(c,d)}:this.el.addEventListener("DOMMouseScroll",function(d){var d=d||a.event;d._detail=-(d.detail||0)/3,b.call(c,d)},!1)},initScrollBar:function(){this.buildBar(),d.isMobile||this.initDrag(),this.scrollTo&&this.doScrollto()},buildBar:function(){var e,f,g,h,i,a=this.el.parentNode,b=a.style;"none"===d.getStyle(a,"display")&&(a.tmpStyle=b.cssText,b.cssText+=";position: absolute;visibility:hidden;display:block;"),-1!==navigator.userAgent.indexOf("MSIE 8.0")&&!d.getStyle(this.scrollBar.parentNode,"z-index")&&(this.scrollBar.parentNode.style.zIndex=0),e="top"===this.direction?"offsetHeight":"offsetWidth",f=this.scrollBar.style,f[this.direction]=this.prevBtn?(this.CriticalBar.low=this.prevBtn[e])+"px":0,this.elHeight="top"===this.direction?this.el.scrollHeight:this.el.scrollWidth,g="top"===this.direction?"height":"width",h=this.el[e],i=this.scrollBar.parentNode[e]-(this.prevBtn?this.prevBtn[e]:0)-(this.nextBtn?this.nextBtn[e]:0),this.cache.sb_pos=Math.floor(this.cache.els_pos*i/this.elHeight)+this.CriticalBar.low,f[this.direction]=this.cache.sb_pos+"px",f[g]=Math.floor(h*i/this.elHeight)+"px",this.CriticalBar.high=i-parseInt(f[g],10)+this.CriticalBar.low,this.barSpeed=(i-this.scrollBar[e])*this.speed/(this.CriticalEl.high=this.elHeight-h,this.CriticalEl.high)||0,"undefined"!=typeof a.tmpStyle&&(b.cssText=a.tmpStyle,a.tmpStyle=c)},initDrag:function(){var e=!1,f=this.scrollBar,g=this.cache,h="top"===this.direction?"scrollTop":"scrollLeft",i="top"===this.direction?"clientY":"clientX",j=this.el,k=j.parentNode,l=this.scrollBar.style,m=this;f.onmousedown=function(f){var f=f||a.event;g.ms_pos=f[i],e=!0,k.mouseout&&(d.detachEvent(k,"mouseover",k.mouseover),d.detachEvent(k,"mouseout",k.mouseout)),b.onselectstart=function(){return!1},b.onmousemove=function(b){var f,c,d;b=b||a.event,e&&(g.ms_lastpos=b[i],c=g.ms_lastpos-g.ms_pos,d=g.sb_pos+c,d<m.CriticalBar.low&&(d=m.CriticalBar.low),d>=m.CriticalBar.high&&(d=m.CriticalBar.high),f=c*m.speed/m.barSpeed,j[h]=g.els_pos+f,l[m.direction]=d+"px"),b.preventDefault?b.preventDefault():b.returnValue=!1},b.onmouseup=function(){e=!1,g.els_pos=j[h],g.sb_pos=parseInt(l[m.direction],10);try{b.onselectstart=b.onmouseup=b.onmousemove=c}catch(a){}k.mouseout&&(d.addEvent(k,"mouseover",k.mouseover),d.addEvent(k,"mouseout",k.mouseout)),g.els_pos===m.CriticalEl.high&&m.done&&m.activeType&&m.doneCallback(m.done)}}},bind:function(){var e,g,h,i,k,l,a="top"===this.direction?"scrollTop":"scrollLeft";d.isMobile?(e=!1,this.scrollBar,g=this.cache,h="top"===this.direction?"pageY":"pageX",i=this.el,i.parentNode,k=this.scrollBar.style,l=this,this.el.addEventListener("touchstart",function(d){function f(b){if(e){g.ms_lastpos=b.touches[0][h];var f,c=g.ms_pos-g.ms_lastpos,d=g.sb_pos+c;d<l.CriticalBar.low&&(d=l.CriticalBar.low),d>=l.CriticalBar.high&&(d=l.CriticalBar.high),f=c*l.speed/l.barSpeed,i[a]=g.els_pos+f,k[l.direction]=d+"px"}b.preventDefault()}function j(){e=!1,g.els_pos=i[a],g.sb_pos=parseInt(k[l.direction],10);try{b.onselectstart=c,l.el.removeEventListener("touchmove",f,!1),l.el.removeEventListener("touchend",j,!1)}catch(d){}g.els_pos===l.CriticalEl.high&&l.done&&l.activeType&&l.doneCallback(l.done)}g.ms_pos=d.touches[0][h],e=!0,b.onselectstart=function(){return!1},l.el.addEventListener("touchmove",f,!1),l.el.addEventListener("touchend",j,!1)},!1)):(this.mousewheel(function(b){b._detail<0?this.process({barSpeed:this.barSpeed,speed:this.speed,direction:a}):b._detail>0&&this.process({barSpeed:-this.barSpeed,speed:-this.speed,direction:a})}),this.unbindDocumentEvent()),this.init&&this.init()},unbindDocumentEvent:function(){var a=this;d.addEvent(this.el,"mouseover",function(c){var e=c.relateTarget||c.fromElement;d.isContains(a.el,e)||("onmousewheel"in a.el?b.onmousewheel=function(){return!1}:(b.tmpDOMMouseScroll=function(a){a.preventDefault()},b.addEventListener("DOMMouseScroll",b.tmpDOMMouseScroll,!1)))}),d.addEvent(this.el,"mouseout",function(c){var e=c.relateTarget||c.toElement;d.isContains(a.el,e)||("onmousewheel"in a.el?b.onmousewheel=null:b.removeEventListener("DOMMouseScroll",b.tmpDOMMouseScroll,!1))})},doScrollto:function(){if(!(this.scrollTo>this.CriticalEl.high||this.scrollTo<this.CriticalEl.low)){var a="top"===this.direction?"scrollTop":"scrollLeft";this.cache.els_pos=this.el[a]=this.scrollTo,this.scrollBar.style[this.direction]=(this.cache.sb_pos+=this.scrollTo/this.speed*this.barSpeed)+"px"}},doAutoScroll:function(){},doBtnEvent:function(){function g(c,d){var g,h,i;1===d?(g=b.speed,h=b.barSpeed,i=1):(g=-b.speed,h=-b.barSpeed,i=-1),function(){b.process({direction:f,speed:g,barSpeed:h}),e=a.requestAnimationFrame(arguments.callee)}()}var e,f,b=this;b.el,f="top"===this.direction?"scrollTop":"scrollLeft",d.isMobile?(this.nextBtn.addEventListener("touchstart",function(a){g(a,1),a.preventDefault()}),this.nextBtn.addEventListener("touchend",function(){a.cancelAnimationFrame(e)}),this.prevBtn.addEventListener("touchstart",function(a){g(a,-1),a.preventDefault()}),this.prevBtn.addEventListener("touchend",function(){a.cancelAnimationFrame(e)})):(this.nextBtn.onmousedown=function(b){var b=b||a.event;g(b,1),b.preventDefault?b.preventDefault():b.returnValue=!1},this.prevBtn.onmousedown=function(b){var b=b||a.event;g(b,-1),b.preventDefault?b.preventDefault():b.returnValue=!1},this.nextBtn.onmouseup=this.prevBtn.onmouseup=function(){a.cancelAnimationFrame(e)})},barFocus:function(){function h(b,d){var e=(d-b)/16;!function(){c.opacity=b,c.filter="alpha(opacity="+Math.floor(100*b)+")",b===d?(b>=1&&c.removeAttribute&&c.removeAttribute("filter"),a.cancelAnimationFrame(f)):(b+=e,f=a.requestAnimationFrame(arguments.callee))}()}var f,g,c=this.scrollBar.parentNode.style,e=this.el.parentNode;c.zoom=1,g=function(b,c){var f;b=a.event||b,f=b.relatedTarget||b[c],d.isContains(e,f)||("fromElement"===c?h(0,1):h(1,0))},e.mouseover=function(a){g(a,"fromElement")},e.mouseout=function(a){g(a,"toElement")},d.addEvent(e,"mouseover",e.mouseover),d.addEvent(e,"mouseout",e.mouseout)},process:function(a){var b=a.direction,c=this.el,e=this.scrollBar.style,f=this.cache;f.sb_pos+=a.barSpeed||this.barSpeed,f.sb_pos>=this.CriticalBar.high&&(f.sb_pos=this.CriticalBar.high,f.els_pos=this.CriticalEl.high)&&this.done&&this.activeType&&this.doneCallback(this.done),f.sb_pos<this.CriticalBar.low&&(f.sb_pos=this.CriticalBar.low,f.els_pos=this.CriticalEl.low),c[b]=f.els_pos+=a.speed,e[this.direction]=f.sb_pos+"px"},doneCallback:function(a){var b=this;clearTimeout(a.timmer),a.timmer=setTimeout(function(){a.call(b)},50)},ajax:function(c){function g(){"undefined"==typeof e.jsonp&&c.onerror&&c.onerror.call(d),e.clearAttributes?e.clearAttributes():e.onload=e.onreadystatechange=e.onerror=null,e.parentNode.removeChild(e),d._callbackLock_=!0}var e,f,h,i,d=this;d._callbackLock_&&(d._callbackLock_=!1,"jsonp"===c.type?(e=b.createElement("script"),f=c.callbackName?c.callbackName:"iScroll"+encodeURIComponent(location.href).replace(/[^\w\s]/g,""),a[f]=function(a){e.jsonp=1,c.onsuccse&&c.onsuccse.call(d,a),d._callbackLock_=!0,d.buildBar()},e.readyState?e.onreadystatechange=function(){/loaded|complete/i.test(e.readyState)?g():"loading"===e.readyState&&c.onprocess&&c.onprocess.call(d)}:e.onload=e.onerror=function(){g()},e.src=c.url+(-1!==c.url.indexOf("?")?"&callback=":"?callback=")+f,b.getElementsByTagName("head")[0].appendChild(e)):(h=a.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),i="text/plain"===c.dataType||"undefined"==typeof c.dataType?"responseText":"text/xml"===c.dataType&&"responseXML",h.open(c.type?c.type:"get",c.url,!0),h.onreadystatechange=function(){4===h.readyState?(h.status>=200&&h.status<300||304===h.status?(c.onsuccse&&c.onsuccse.call(d,h[i]),d.buildBar()):c.onerror&&c.onerror.call(d,h.statusText),d._callbackLock_=!0):3===h.readyState&&c.onprocess&&c.onprocess.call(d)},"post"===c.type&&h.setRequestHeader("content-type","application/x-www-form-urlencoded"),h.send(null)))}},d.addEvent=function(a,b,c){return"function"==typeof addEventListener?a.addEventListener(b,c,!1):a.attachEvent("on"+b,c)},d.detachEvent=function(a,b,c){return"function"==typeof removeEventListener?a.removeEventListener(b,c,!1):a.detachEvent("on"+b,c)},d.isContains=function(a,b){return a.contains?a.contains(b):16==a.compareDocumentPosition(b)},d.getStyle=function(a,b){return a.style[b]?a.style[b]:a.currentStyle?a.currentStyle[b]:window.getComputedStyle(a,null)[b]},d.isMobile="ontouchend"in b?!0:!1,a.requestAnimationFrame=a.requestAnimationFrame||a.mozRequestAnimationFrame||a.webkitRequestAnimationFrame||a.msRequestAnimationFrame||a.oRequestAnimationFrame||function(a){return setTimeout(a,1e3/60)},a.cancelAnimationFrame=a.cancelAnimationFrame||a.mozCancelAnimationFrame||a.webkitCancelAnimationFrame||a.msCancelAnimationFrame||a.oCancelAnimationFrame||function(a){return clearTimeout(a,1e3/60)};var e={init:function(a){return new d(a)}};a.iScroll=e}(window,document);