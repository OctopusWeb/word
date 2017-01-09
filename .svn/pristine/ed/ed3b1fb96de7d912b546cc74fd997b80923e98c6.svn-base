(function(doc, exportName) {
	var _console = window.console && window.console.log;
	var PREFIX = ['webkit', 'moz', 'ms', ''];
	var $ = function(dom,pl,pt,callback) {
		if((typeof dom).toLowerCase() != "object") {
			if(_console) {
				console.error('nelsonVS()所传入的元素无法执行此操作')
			}
			return;
		};
		this.dom = dom;
		this.pl = pl ? pl : 0;
		this.pt = pt ? pt : 0;
		this.closeCallbackFun = callback.closeCallback ? callback.closeCallback : "";
		this.parentDom = this.dom.parentNode;
		this.pic = this.dom.querySelector(".pic-container-inner");
		this.editBtns = dom.querySelectorAll(".edit-btn");
		this.closeBtn = dom.querySelector(".close");
		this.flipBtn = dom.querySelector(".flip");
		this.resizeBtn = dom.querySelector(".resize");
		this.transformJson = {
			rx: 0,
			ry: 0,
			rz: 0,
			s: 0
		};

		this.setOrigin();
		this.init();
	}
	$.prototype = {
		init: function() {
			var that = this;
			this.resizeBtn.addEventListener("drag", function(e) {
				e.stopPropagation();
				var currentX = e.detail.center.x;
				var currentY = e.detail.center.y;
				var distance = Math.sqrt((currentX - that.OX) * (currentX - that.OX) + (currentY - that.OY) * (currentY - that.OY));
				//distance == b ; that.OR == c
				var a = Math.sqrt((currentX - that.flipX) * (currentX - that.flipX) + (currentY - that.flipY) * (currentY - that.flipY));
				//计算当前旋转角度
				var angle = Math.acos((that.OR * that.OR + distance * distance - a * a) / (2 * that.OR * distance)) * 180 / Math.PI;
				//判断点在直线哪侧
				var Y0 = (that.OY - that.flipY) / (that.OX - that.flipX) * currentX + (that.flipY * that.OX - that.OY * that.flipX) / (that.OX - that.flipX);
				if(currentY <= Y0) {
					angle = 180 + 180 - angle
				}
				//计算缩放比例
				var scale = distance / that.OR;
				var _scale = that.OR / distance;
				//进行变换
				that.transformJson.s = scale;
				that.transformJson.rz = angle;
				that.dom.setAttribute("data-scale",scale);
				that.dom.setAttribute("data-_scale",_scale);
				that.dom.setAttribute("data-angle",angle);
				for(var i = 0 ; i < PREFIX.length ; i++){
					that.dom.style[PREFIX[i] + "Transform"] = "scale(" + that.transformJson.s + ") rotateZ(" + that.transformJson.rz + "deg)";
					for(var j = 0 ; j < that.editBtns.length ; j++){
						that.editBtns[j].style[PREFIX[i] + "Transform"] = "scale(" + _scale + ")";
					}
				}
			})
			this.dom.addEventListener("tap",function(e){
				e.stopPropagation();
				console.log("stopPropagation");
				playWord();
			})
			this.dom.addEventListener("longtap", function(e) {
				e.stopPropagation();
				that.modifyEditState(true)
			})
			this.dom.addEventListener("dragstart", function(e) {
				e.stopPropagation();
				that.moved = false;
			})
			this.dom.addEventListener("drag", function(e) {
				e.stopPropagation();
				var distanceX = e.detail.deltaX;
				var distanceY = e.detail.deltaY;
				that.moved = true;
				if(!that.getEditState()) {
					return;
				}
				that.dom.style.left = that.offsetX + distanceX + "px";
				that.dom.style.top = that.offsetY + distanceY + "px";
			})
			this.dom.addEventListener("dragend", function(e) {
				e.stopPropagation();
				if(that.moved) {
					that.setOrigin();
				}
			})
			this.flipBtn.addEventListener("tap", function(e) {
				e.stopPropagation();
				that.transformJson.ry = that.transformJson.ry == 180 ? 0 : 180;
				that.dom.setAttribute("data-flip",that.transformJson.ry);
				for(var i = 0; i < PREFIX.length; i++) {
					that.pic.style[PREFIX[i] + "Transform"] = "rotateY(" + that.transformJson.ry + "deg)";
				}
			})
			this.closeBtn.addEventListener("tap", function(e) {
				e.stopPropagation();
				that.dom.parentNode.removeChild(that.dom);
				that.closeCallbackFun();
				mui(".inputFoot")[0].style.display = "block"
				mui(".imgList")[0].style.display = "none";
				statusFlag = 1;
			})
		},
		getEditState: function() {
			return this.dom.classList.contains('active');
		},
		modifyEditState: function(status) {
			this.dom.classList[status ? 'add' : 'remove']('active');
		},
		setOrigin: function() {
			var w = this.dom.offsetWidth / 2;
			var h = this.dom.offsetHeight / 2;
			this.offsetX = this.dom.offsetLeft;
			this.offsetY = this.dom.offsetTop;
			this.OR = Math.sqrt(w * w + h * h);
			this.OX = this.offsetX + w + this.pl;
			this.OY = this.offsetY + h + this.pt;
			this.flipX = this.dom.offsetLeft + this.dom.offsetWidth + this.pl;
			this.flipY = this.dom.offsetTop + this.dom.offsetHeight + this.pt;
		},
		getMin: function(o1, o2) {
			return o1 <= o2 ? o1 : o2;
		}
	}

	function ctrObj(dom,pl,pt,callback) {
		return new $(dom,pl,pt,callback);
	}

	window[exportName] = ctrObj;

})(document, 'imgCtr');