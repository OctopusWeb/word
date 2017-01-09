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
var listenContorller = {};
var imgContorller = {};
var inputContorller = {};
var imgInfoContprller = {};
var searchWord;
var mp3Play = {};
var picData;

init();

function init(){
	mui.getJSON("../js/maps.json",function(response){
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
	imgList.style.display = "block";
	if(!inputSearchBtn.value) {
		mui.toast('搜索内容不能为空')
		return
	}
	searchWord = inputSearchBtn.value;
	listenContorller.listenOver();
	inputFoot.style.display = "none";
})
inputSearchBtn.addEventListener("focus", function() {
	imgList.style.display = "none";
})
inputSearchBtn.onkeyup = function(e) {
		if(e.keyCode == 13) {
			if(!this.value) {
				mui.toast('搜索内容不能为空')
				return
			}
			searchWord = this.value;
			listenContorller.listenOver();
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
			mui.toast("您说的是：" + s)
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
			
			mui.toast("您说的是：" + s)
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
			if(statusFlag == 1) {
				listenContorller.showGallery();
			}
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
	if(statusFlag == 1){
		var item = inputContorller.search(searchWord[0],false);
		statusFlag = 0;
	}else{
		var item = inputContorller.search(searchWord[0],true);
	}
	if(item.length == 1) {
		appendHTML(document.getElementById("btn"), baidu.template("editTemp", {
			edit: true,
			_src: "../images/maps/" + item[0],
			domid: "",
			setPara:false
		}))
		bol = true;
		imgContorller.init();
	} else if(item.length == 0) {
		mui.toast('Sorry, no tag was found', {
			duration: 'short',
			type: 'div'
		})
		listenContorller.btnCtr();
	}else{
		listenContorller.showGalleryList(item);
	}
}
listenContorller.showGallery = function() {
	inputFoot.style.display = "block";
}
listenContorller.showGalleryList = function(arr) {
	var index="<ul>"
	for (var i=0;i<arr.length;i++) {
		index+='<li><img src="../images/maps/'+arr[i]+'"/></li>'
	}
	index+='</ul>';
	mui(".imgList")[0].innerHTML = index;
}
listenContorller.hideGallery = function() {
	inputFoot.style.display = "none";
}
mui(".imgList").on("tap", "li", function() {
	var _src = this.children[0].src;
	var num = _src.lastIndexOf("/");
	var editDom = document.querySelector(".pic-container.active");
	if(editDom){
		editDom.parentNode.removeChild(editDom);
	}
	appendHTML(document.getElementById("btn"), baidu.template("editTemp", {
		edit: true,
		_src: _src,
		domid: "",
		setPara:false
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
			console.log(editDoms[i].className)
			editDoms[i].classList.remove("active");
		}
		listenContorller.btnCtr();
		setTietu()
	}
})
/*搜索匹配*/
inputContorller.search = function(text,bol) {
	text = codefans_net_CC2PY(text).toLowerCase();
	var item = [];
	var itemLinshi;
	var json = picData.allVersion;
	for (version in json) {
		for (type in json[version]) {
			for (group in json[version][type]) {
				for (var i=0;i<json[version][type][group].length;i++) {
					bol?firstListen(json[version][type][group][i],text):secondListen(json[version][type][group][i],text,json[version][type][group])
				}
				
			}
		}
	}
	function firstListen(mapsWord,text){
		if(mapsWord.indexOf(text) != -1) {
			item.push(mapsWord);
		}
	}
	function secondListen(mapsWord,text,mapsGroup){
		if(mapsWord.indexOf(text) != -1) {
			item.push(mapsWord);
			itemLinshi = mapsGroup
		}
	}
	if(!bol){item = item.concat(itemLinshi)}
	return item;
}

imgInfoContprller.initItem = function() {

}
imgInfoContprller.getItem = function() {

}
imgInfoContprller.setItem = function() {

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
	var bgImageUrl = document.querySelector(".image").getAttribute("data-file");
	var bgImageKey = bgImageUrl.substring(bgImageUrl.lastIndexOf("/") + 1, bgImageUrl.lastIndexOf("."));
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
	var bgImageKey = imgUrl.substring(imgUrl.lastIndexOf("/") + 1, imgUrl.lastIndexOf("."));
	var tagCache = localStorage.getItem("tagCache");

	if(!tagCache) {
		return;
	}
	console.log(tagCache)
	tagCache = JSON.parse(tagCache);
	if(tagCache[bgImageKey]) {
		for(var i = 0; i < tagCache[bgImageKey].length; i++) {
			appendHTML(document.getElementById("btn"), baidu.template("editTemp", {
				edit: false,
				setPara:true,
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
//					console.log("-----"+tagCache[bgImageKey][i]._scale)
					curEditBtns[m].style[PREFIX[j] + "Transform"] = "scale(" + tagCache[bgImageKey][i]._scale + ")";
				}
			}
		}
		imgContorller.init();
	}
}