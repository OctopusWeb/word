mui.init({
	gestureConfig: {
		tap: true, //默认为true
		longtap: true, //默认为false
		drag: true, //默认为true
	}
});
var PREFIX = ['webkit', 'moz', 'ms', ''];
var editObjs = [];
var statusFlag = 0;
var btnActive = mui(".btnActive")[0];
var btnUnable = mui(".btnUnable")[0];

var bluePerson = mui(".bluePerson")[0];
var bluePerson1 = mui(".bluePerson")[1];

var audio1 = mui(".audio1")[0];
var audio2 = mui(".audio2")[0];
var audio3 = mui(".audio3")[0];

var btn = mui(".btn")[0]
var newImg = mui(".newImg")[0];
var changeImg = mui(".changeImg")[0];
var maps = mui(".map")[0];
var inputFoot = mui(".inputFoot")[0];
var inputSearchBtn = mui(".inputSearch")[0]
var btnImgBk = document.getElementById("mask");
var appmask = document.getElementById("appmask");
var add = mui(".add")[0];
var imgList = mui(".imgList")[0]
var gContainer = document.getElementById("container")
var listenContorller = {};
var imgContorller = {};
var inputContorller = {};
var imgInfoContprller = {};
var searchWord;
var mp3Play = {};
var picData;
var gallNum = true;

init();

function init() {
	mui.getJSON("../js/maps.json", function(response) {
		picData = response;
		//		var pinyins = codefans_net_CC2PY("西红柿");
		//		var item = inputContorller.search(pinyins,false);
	});
}

mp3Play.startPlay = function(type, callback) {
	if(plus.audio == undefined) {
		alert("Audio not ready!");
		return;
	}
	var _location = "";
	switch(type) {
		case 1:
			_location = "_www/mp3/newMp3/01_giant_voice_01_en.mp3";
			break;
		case 2:
			_location = "_www/mp3/newMp3/03_giant_voice_02_en.mp3";
			break;
		case 3:
			_location = "_www/mp3/newMp3/05_giant_voice_03_en.mp3";
			break;
		case 4:
			_location = "_www/mp3/newMp3/07_giant_voice_04_en.mp3";
			break;
	}
	p = plus.audio.createPlayer(_location);
	p.play(function() {
		callback ? callback() : "";
	}, function(e) {
		alert("Audio play error:" + JSON.stringify(e));
	});
}
btnActive.addEventListener("tap", function(e) {
	e.stopPropagation();
	listenContorller.btnCtr("un");
	listenContorller.toggleNoticePic(1, 0)
	mp3Play.startPlay(1, listenContorller.listenWord);
});

add.addEventListener("tap", function() {
	setTimeout(function() {
		gContainer.style.display = "block";
	}, 500)
})
inputSearchBtn.addEventListener("focus", function() {
	gContainer.style.display = "none";
})
inputSearchBtn.addEventListener("blur", function() {
	gContainer.style.display = "block";
})
inputSearchBtn.onkeyup = function(e) {
		if(e.keyCode == 13) {
			if(!this.value) {
				mui.toast('搜索内容不能为空')
				return
			}
			var editDom = document.querySelector(".pic-container.active");
			if(editDom) {
				editDom.parentNode.removeChild(editDom);
			}
			searchWord = this.value;
			this.value = "";
			listenContorller.listenOver();
			imgList.style.display = "block";
			inputFoot.style.display = "none";
		}
	}
	//speech按钮状态切换
listenContorller.btnCtr = function(type) {
	if(type == "un") {
		btnUnable.style.display = "block";
		btnActive.style.display = "none";
	} else {
		btnUnable.style.display = "none";
		btnActive.style.display = "block";
	}
}
listenContorller.toggleNoticePic = function(a, b) {
		appmask.style.display = (a || b) ? "block" : "none";
		bluePerson.style.display = a ? "block" : "none";
		bluePerson1.style.display = b ? "block" : "none";
	}
	/*语音听写状态*/
listenContorller.listenWord = function() {
		var flag = false;
		var options = {
			engine: 'iFly',
			lang: 'zh-cn',
			punctuation: false,
			onend: function(e) {
				if(!flag) {
					plus.speech.stopRecognize();
					listenContorller.listenErr();
					flag = false;
				}
			}
		};
		plus.speech.startRecognize(options, function(s) {
			flag = true;
			searchWord = s;
			//			mui.toast("您说的是：" + s)
			listenContorller.listenOver();
		}, function(e) {
			flag = true;
			plus.speech.stopRecognize();
			listenContorller.listenErr();
		});
	}
	/*语音听写状态2*/
listenContorller.listenWord2 = function() {
		var flag = false;
		var options = {
			engine: 'iFly',
			lang: 'zh-cn',
			punctuation: false,
			onend: function(e) {
				if(!flag) {
					plus.speech.stopRecognize();
					mp3Play.startPlay(4, function() {
						listenContorller.toggleNoticePic(0, 0);
						listenContorller.btnCtr();
					});
					flag = false;
				}
			}
		};
		plus.speech.startRecognize(options, function(s) {
			flag = true;
			statusFlag = 1;
			searchWord = s;

			//			mui.toast("您说的是：" + s)
			listenContorller.listenOver();
		}, function(e) {
			plus.speech.stopRecognize();
			flag = true;
			mp3Play.startPlay(4, function() {
				listenContorller.toggleNoticePic(0, 0)
				listenContorller.btnCtr();
			});
		});

	}
	/*语音识别完毕*/
listenContorller.listenOver = function() {
		mp3Play.startPlay(3, function() {
			listenContorller.toggleNoticePic(0, 0);
			listenContorller.searchImg();
		});
	}
	/*识别错误*/
listenContorller.listenErr = function() {
	listenContorller.toggleNoticePic(0, 1)
	mp3Play.startPlay(2, function() {
		listenContorller.listenWord2();
	});
}

/*通过识别搜索*/
listenContorller.searchImg = function() {
	var bol = false;
	if(statusFlag == 1) {
		var item = inputContorller.search((typeof searchWord) == 'string' ? searchWord : searchWord[0], false);
		statusFlag = 0;
	} else {
		var item = inputContorller.search((typeof searchWord) == 'string' ? searchWord : searchWord[0], true);
	}
	console.log(JSON.stringify(item))
	if(item.curItem){
		if(item.curItem.length == 1 && !item.cur) { 
			appendHTML(document.getElementById("btn"), baidu.template("editTemp", {
				edit: true,
				_src: "../images/maps/" + item.curItem[0],
				domid: "",
				setPara: false
			}))
			bol = true;
			imgContorller.init();
		} else if(item.curItem.length == 0 && !item.cur) {
			mui.toast('Sorry, no tag was found', {
				duration: 'short',
				type: 'div'
			})
			listenContorller.btnCtr();
		} else if(item.curItem.length >= 1){ 
			listenContorller.showGallery();
			if(item.curItem.length == 1){
				var cr = item.cur;
				
				var ci = cr.indexOf(item.curItem[0]);
				var newCr = [];
				for(var i = ci ; i < cr.length ; i++){
					newCr.push(cr[i])
				}
				listenContorller.showGalleryList({
					curItem:newCr,
					cur:ci,
					other:item.other
				});
			}else{
				var ci=[];
				var newCr = [];
				if(item.cur){
					var cr = item.cur;
					ci = cr.indexOf(item.curItem[0]);
					
					for(var i = ci+1 ; i < cr.length-1 ; i++){
						newCr.push(cr[i])
					}
				}
				
				var data1 = item.curItem.concat(newCr)
				var data = {
					"curItem":data1,
					"other":item.other
				}
				listenContorller.showGalleryList(data);
			}
			appendHTML(document.getElementById("btn"), baidu.template("editTemp", {
				edit: true,
				_src: "../images/maps/" + item.curItem[0],
				domid: "",
				setPara: false
			}))
			bol = true;
			imgContorller.init();
		}
	}else{
		mui.toast('Sorry, no tag was found', {
			duration: 'short',
			type: 'div'
		})
		listenContorller.btnCtr();
	}
	
}
listenContorller.showGallery = function() {
	inputFoot.style.display = "block"
}
listenContorller.showGalleryList = function(arr) {
	
	var index = baidu.template('gtemp',{data:arr.curItem})
	for (var i=0;i<arr.other.length;i++) {
		index+=baidu.template('gtemp',{data:arr.other[i]})
	}
	document.getElementById("imgList").innerHTML = index;
	var ulAll = document.getElementById("imgList").querySelectorAll(".gItemUl")
	for(var i = 0 ; i < ulAll.length ; i++){
		ulAll[i].style.width = ulAll[i].children.length * 80 + 10 + "px";
	}
}

listenContorller.hideGallery = function() {
	inputFoot.style.display = "none"
}
mui(".imgList").on("tap", "li", function() {
		var _src = this.children[0].src;
		var num = _src.lastIndexOf("/");
		var editDom = document.querySelector(".pic-container.active");
		if(editDom) {
			editDom.parentNode.removeChild(editDom);
		}
		appendHTML(document.getElementById("btn"), baidu.template("editTemp", {
			edit: true,
			_src: _src,
			domid: "",
			setPara: false
		}))
		listenContorller.hideGallery()
		imgContorller.init();
	})
	/*图片变形功能初始化*/
imgContorller.init = function() {
		//循环初始化新增编辑框的编辑函数
		var editDoms = document.querySelectorAll(".pic-container");
		for(var i = 0; i < editDoms.length; i++) {
			if(!editDoms[i].getAttribute("data-inited")) {
				editObjs.push(new imgCtr(editDoms[i], 0, 120, {
					closeCallback: listenContorller.btnCtr
				}));
				editDoms[i].setAttribute("data-inited", true)
			}
		}
	}
	//确认编辑状态

document.body.addEventListener("tap", function(e) {
		if(e.target.className.indexOf('btn') >= 0) {
			var editDoms = document.querySelectorAll(".pic-container.active");
			for(var i = 0; i < editDoms.length; i++) {
				editDoms[i].classList.remove("active");
			}
			listenContorller.btnCtr();
			listenContorller.hideGallery();
			setTietu()
		}
	})
	/*搜索匹配*/
inputContorller.search = function(text, bol) {
	var text1 = text;
	
	if(/^[\u4e00-\u9fa5]+$/.test(text)) { 
		text.replace(/。/g, '');
		text = codefans_net_CC2PY(text).toLowerCase();
	} else {
		text = text.toLowerCase();
	}
	text = correction(text)
	mui.toast("您说的是:" +text1 + text);
	var item = [];
	var itemUse =[]; 
	var itemOther = [];
	var itemLinshi;
	var types;
	var json = picData.allVersion;
	for(var version in json) {
		for(var type in json[version]) {
			var types = type;
			for(var group in json[version][type]) {
				for(var i = 0; i < json[version][type][group].length; i++) {
					bol ? firstListen(json[version][type][group][i], text) : secondListen(json[version][type][group][i], text, json[version][type][group],types)
				} 

			}
		}
	}
	function getItems(types){ 
		var bool=false;
		for(var version in json) {
			for( var type in json[version]) {
				if(type == types){
					bool=true;
				}
				if(type != types && types && bool){
					for(var group in json[version][type]) { 
						var item0 = json[version][type][group];
						itemOther.push(item0)
					}
				}
			}
		}
	}

	function firstListen(mapsWord, text) { 
		if(mapsWord.indexOf(text) != -1) {
			itemUse.push(mapsWord);
			item.push(itemUse,itemOther)
		}
	}

	function secondListen(mapsWord, text, mapsGroup,type) {
		if(mapsWord.indexOf(text) != -1 ) {
			if(gallNum){
				gallNum = false;
				getItems(type);
				itemLinshi = mapsGroup;
			}
			itemUse.push(mapsWord);
			
//			itemUseIndex = itemLinshi.indexOf(itemUse[0]);
//			itemLinshi = itemLinshi.splice(itemUseIndex + 1,itemLinshi.length)
		} 
	}
	function correction(text){ 
		text == "sangren" ? text="sangshen" : text = text;
		text == "ninmeng" ? text="ningmeng" : text = text;
		text == "mijie" ? text="miju" : text = text;
		text == "jinjie" ? text="jinju" : text = text;
		text == "shancha" ? text="shanzha" : text = text;
		text == "laoshuzhao" ? text="laoshuzhua" : text = text;
		text == "xueligong" ? text="xuelihong" : text = text;
		text == "canghonghua" ? text="zanghonghua" : text = text;
		return text;
	}
	
	if(!bol && itemUse.length != 0) {
		getItems();
		item.push(itemLinshi,itemOther)
	}
	gallNum = true;
	return {
		curItem:itemUse,
		cur:itemLinshi,
		other:itemOther
	};
}

function appendHTML(dom, html) {
	var divTemp = document.createElement("div"),
		nodes = null,
		fragment = document.createDocumentFragment();
	divTemp.innerHTML = html;
	nodes = divTemp.childNodes;
	for(var i = 0, length = nodes.length; i < length; i += 1) {
		fragment.appendChild(nodes[i].cloneNode(true));
	}
	dom.appendChild(fragment);
	nodes = null;
	fragment = null;
};

//localStorage.setItem("tagCache",'')
function setTietu() {
	var tagCache = localStorage.getItem("tagCache");
	tagCache = tagCache ? JSON.parse(tagCache) : {};
	var domBox = document.querySelectorAll(".pic-container");
	var bgImageUrl = document.querySelector(".image").getAttribute("data-id");
	var bgImageKey = bgImageUrl
	var tietuArr = [];
	for(var i = 0; i < domBox.length; i++) {
		var domImg = domBox[i];
		var imgSrc = domImg.getAttribute("data-src");
		imgSrc = "../images/maps/" + imgSrc.substring(imgSrc.lastIndexOf("/") + 1, imgSrc.length);
		var tietuInfo = {
			src: imgSrc,
			scale: domImg.getAttribute("data-scale") ? domImg.getAttribute("data-scale") : 1,
			_scale: domImg.getAttribute("data-_scale") ? domImg.getAttribute("data-_scale") : 1,
			flip: domImg.getAttribute("data-flip") ? domImg.getAttribute("data-flip") : 0,
			angle: domImg.getAttribute("data-angle") ? domImg.getAttribute("data-angle") : 0,
			left: domImg.offsetLeft,
			top: domImg.offsetTop
		};
		tietuArr.push(tietuInfo);
	}
	tagCache[bgImageKey] = tietuArr;
	localStorage.setItem("tagCache", JSON.stringify(tagCache));
}

function initTietu(imgUrl) {
	var bgImageKey = imgUrl;
	var tagCache = localStorage.getItem("tagCache");

	if(!tagCache) {
		return;
	}
	tagCache = JSON.parse(tagCache);
	if(tagCache[bgImageKey]) {
		for(var i = 0; i < tagCache[bgImageKey].length; i++) {
			appendHTML(document.getElementById("btn"), baidu.template("editTemp", {
				edit: false,
				setPara: true,
				_src: tagCache[bgImageKey][i].src,
				domid: "container" + bgImageKey + i,
				scale: tagCache[bgImageKey][i].scale,
				_scale: tagCache[bgImageKey][i]._scale,
				flip: tagCache[bgImageKey][i].flip,
				angle: tagCache[bgImageKey][i].angle,
			}));
			var curDom = document.getElementById("container" + bgImageKey + i);
			curDom.style.left = tagCache[bgImageKey][i].left + "px";
			curDom.style.top = tagCache[bgImageKey][i].top + "px";
			for(var j = 0; j < PREFIX.length; j++) {
				curDom.style[PREFIX[j] + "Transform"] = "scale(" + tagCache[bgImageKey][i].scale + ") rotateZ(" + tagCache[bgImageKey][i].angle + "deg) rotateY(" + tagCache[bgImageKey][i].flip + "deg)";
				var curEditBtns = curDom.querySelectorAll(".edit-btn");
				for(var m = 0; m < curEditBtns.length; m++) {
					curEditBtns[m].style[PREFIX[j] + "Transform"] = "scale(" + tagCache[bgImageKey][i]._scale + ")";
				}
			}
		}
		imgContorller.init();
	}
}
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005
});

