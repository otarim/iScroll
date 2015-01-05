#模拟滚动条(iScroll)
---
##example
简单地例子:

		iScroll.init({
        	el: document.getElementById('inner-content'),
        	scrollBar: document.getElementById('tool-bar')
    	})
比较复杂的例子:

		iScroll.init({
        	el: document.getElementById('inner-content2'),
        	direction: 'left',
        	scrollBar: document.getElementById('tool-bar2'),
        	scrollTo: 100,
        	prevBtn: document.getElementById('tool-prevBtn'),
        	nextBtn: document.getElementById('tool-nextBtn'),
        	speed: 20,
        	focus: true,
        	init: function(){
        		try{
        			console.log('init~')
        		}catch(e){}
        	},
        	// ajaxBtn: document.getElementById('btn'),
        	done: function(){
            	this.ajax({
                	url: 'ajax.html',
                	type: 'get',
                	onsuccse: function(data){
                		contentArea.innerHTML += data;
                	},
                	onprocess: function(){
                	},
                	onerror: function(){
                	}
            	})
        	}
    	})
    		
##property
===
**el**

	绑定滚动事件的对象
	
**direction**	

	滚动方向 [top left] 默认top

**activeDirection**

	回调触发方式（up 为上（左）拉，down 为下（右）拉）默认 down
	
**scrollBar**

	指定滚动条
	
**prevBtn**	
	
	可选，滚动控制句柄

**nextBtn**	

	可选，滚动控制句柄

**speed**	

	滚动速度，默认10

**focus**	

	是否显隐滚动条，默认false
	
**ajaxBtn**

	绑定ajax事件的元素，默认为滚动到底部触发ajax操作，设定之后是点击进行ajax操作
	
##method
===
**init**	
	
	初始化函数，可选
	
**done**

	滚动事件触发的回调，可选

**scrollOffset(offset,delay)**

	offset 滚动到的位置(相对于主视图而不是滚动条)
	delay 持续时间，可选	
	指定滚动的位置(非初始化操作)
	
**this.ajax(for done)**
	
	url	请求路径
	type	get|post|jsonp,默认get
	callbackName	callback名字，可选
	dataType	text/plain | text/xml 默认text/plain，对于传统ajax生效，可选
	params		post请求体,字符串'name=xxoo&postData=blabla',可选
	onsuccse	加载完的回调，this指向iScroll实例
	onprocess	ajax请求进行中触发，this指向iScroll实例
	onerror	异常处理，返回ajax的异常信息，this指向iScroll实例
	
**this.buildBar**

	用于更新滚动区域之后的重构滚动条操作，注意在done回调中如果不是使用this.ajax请求数据那么需要手动在请求数据结束之后触发该方法
	
##update.log
====
140211add: touch事件支持  
140428add: 新增scrollOffset方法,现在可以控制滚动的位置了.  
140428fixed: post提交数据的时候,少了params的发送.....  
140428fixed: 修复右键滚动控制按钮的错误
140428add: 新增scrollOffset的 delay 参数，实现平滑过渡
150105add: 新增activeDirection参数用于指定触发操作（下拉，上拉）

##usage
===
1. 按照demo中的html层级结构,wrap>内容区+滚动条(可选)
2. 如果存在图片,记得加上`width`以及`height`的layout
3. 左右滚动的话,现在推荐使用`inline-block`布局
4. 建议使用自带的`ajax`方法...

##issue
===
1. `position:absolute`在部分ie下影响冒泡(原因问题),所以在这里不建议图文布局使用绝对定位  
2. 非专题类不建议使用自定义滚动条,食之无味,弃之可惜.

##demo
===
[iScroll.html](iScroll.html)