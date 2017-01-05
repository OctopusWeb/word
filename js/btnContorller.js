mui.init({
	gestureConfig:{
		tap: true, //默认为true
		doubletap: true, //默认为false
		longtap: true, //默认为false
		swipe: true, //默认为true
		drag: true, //默认为true
		hold:false,//默认为false，不监听
		release:false//默认为false，不监听
	}
});
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
var inputContorller={};
var imgInfoContprller={};
var searchWord;
var imgInfo={
	rotateY:0
};
var imgArr=[];
var mp3Play = {}

mp3Play.startPlay = function(type,callback){
	if ( plus.audio == undefined ) {
		alert( "Audio not ready!" );
		return;
	}
	var _location = "";
	switch(type){
		case 1:_location = "_www/mp3/newMp3/01_giant_voice_01_en.mp3";break;
		case 2:_location = "_www/mp3/newMp3/03_giant_voice_02_en.mp3";break;
		case 3:_location = "_www/mp3/newMp3/05_giant_voice_03_en.mp3";break;
		case 4:_location = "_www/mp3/newMp3/07_giant_voice_04_en.mp3";break;
	}
	p = plus.audio.createPlayer(_location);
	p.play( function () {
		callback ? callback() : "";
	}, function ( e ) {
		alert( "Audio play error:" + JSON.stringify(e)); 
	} ); 
}

btnActive.addEventListener("tap",function(){
	listenContorller.btnCtr("un"); 
	listenContorller.toggleNoticePic(1,0)
	mp3Play.startPlay(1,listenContorller.listenWord);
});

add.addEventListener("tap",function(){
	imgList.style.display = "block";
})
inputSearchBtn.addEventListener("focus",function(){
	imgList.style.display = "none";
})
inputSearchBtn.onkeyup = function(e){
	if(e.keyCode == 13){
		if(!this.value){
			mui.toast('搜索内容不能为空')
			return
		}
		searchWord = this.value;
		listenContorller.listenOver();
		inputFoot.style.display = "none";
	}
}
//speech按钮状态切换
listenContorller.btnCtr = function(type){
	if(type == "un"){
		btnUnable.style.display = "block";
		btnActive.style.display = "none";
	}else{
		btnUnable.style.display = "none";
		btnActive.style.display = "block";
	}
}
listenContorller.toggleNoticePic = function(a,b){
	appmask.style.display = (a || b) ? "block" : "none";
	bluePerson.style.display = a?"block":"none";
	bluePerson1.style.display = b?"block":"none";
}
/*语音听写状态*/
listenContorller.listenWord = function(){
	var flag = false;
	var options = {engine : 'iFly',lang : 'zh-cn',punctuation:false ,onend:function(e){
		if(!flag){
			plus.speech.stopRecognize();
			listenContorller.listenErr();
			flag = false;
		}
	}};
	plus.speech.startRecognize( options, function ( s ) {
		flag = true;
		searchWord = s;
		mui.toast("您说的是："+s)
		listenContorller.listenOver();
	}, function ( e ) {
		flag = true;
		plus.speech.stopRecognize();
		listenContorller.listenErr();
	} );	
}
/*语音听写状态2*/
listenContorller.listenWord2 = function(){
	var flag = false;
	var options = {engine : 'iFly',lang : 'zh-cn',punctuation:false,onend:function(e){
		if(!flag){
			plus.speech.stopRecognize();
			mp3Play.startPlay(4,function(){
				listenContorller.toggleNoticePic(0,0);
				listenContorller.btnCtr();
			});
			flag = false;
		}
	}};
	plus.speech.startRecognize( options, function ( s ) {
		flag = true;
		statusFlag = 1;
		searchWord = s;
		mui.toast("您说的是："+s)
		listenContorller.listenOver();
	}, function ( e ) {
		plus.speech.stopRecognize();
		flag = true;
		mp3Play.startPlay(4,function(){
			listenContorller.toggleNoticePic(0,0)
			listenContorller.btnCtr();
		});
	} );
	
}
/*语音识别完毕*/
listenContorller.listenOver = function(){
	mp3Play.startPlay(3,function(){
		listenContorller.toggleNoticePic(0,0);
		if(statusFlag == 1){
			listenContorller.inputImg();
		}
		listenContorller.searchImg();
	});
}
/*识别错误*/
listenContorller.listenErr = function(){
	listenContorller.toggleNoticePic(0,1)
	mp3Play.startPlay(2,function(){
		listenContorller.listenWord2();
	});
}

/*通过识别搜索*/
listenContorller.searchImg = function(){
	var bol=false;
	var item = inputContorller.search(searchWord[0]);
	if(item.length==1){ 
		appendHTML(document.getElementById("btn"),baidu.template("editTemp",{_src:"../images/maps/"+mapsUrl[item[0]]}))
		bol = true;
		imgContorller.init();
	}else if(item.length==0){
		mui.toast('Sorry, no tag was found',{ duration:'short', type:'div' })
		listenContorller.btnCtr(); 
	}else{
		inputContorller.inputList(item)
	}
}

listenContorller.inputImg = function(){
	inputFoot.style.display = "block";
	statusFlag = 0;
	imgContorller.inputImg();
}

var imgAccesst = {};
var biandaAccesst = {}; 
var xuanzhuanAccesst = {};


/*图片变形功能初始化*/
imgContorller.init = function(){
	newImg.addEventListener("tap",imgContorller.clear);
	//循环初始化新增编辑框的编辑函数
	var editDoms = document.querySelectorAll(".changeImg");
	for(var i = 0 ; i < editDoms.length ; i++){
		if(!editDoms[i].getAttribute("data-inited")){
			editDoms[i].setAttribute("data-inited",true);
			this.bindEvt(editDoms[i]);
		}
	}
}
imgContorller.bindEvt = function(dom){
	var img = dom.querySelector(".map");
	var big = dom.querySelector(".big");
	var flip = dom.querySelector(".flip");
	var closedbtn = dom.querySelector(".closed");
	var rotating = dom.querySelector(".rotating");
	
	dom.addEventListener("tap",function(e){
		e.stopPropagation();
		if(!this.classList.contains("editing")){
			playWord();
		}
	})
	dom.addEventListener("dragstart",function(e){
		e.stopPropagation();
		if(!dom.classList.contains("editing")){return;}
	})
	img.addEventListener("longtap",function(e){
		e.stopPropagation();
		imgContorller.show(dom);
	})
	dom.addEventListener("dragstart",function(estart){
		estart.stopPropagation();
		if(!dom.classList.contains("editing")){return;}
		imgAccesst.domx = dom.offsetLeft;
		imgAccesst.domy = dom.offsetTop;
		imgAccesst.statrX= estart.detail.touches[0].screenX;
		imgAccesst.statrY= estart.detail.touches[0].screenY;
		dom.addEventListener("drag",imgContorller.movePage)
	});
	dom.addEventListener("dragend",function(e){
		if(!dom.classList.contains("editing")){return;}
		dom.removeEventListener("drag",imgContorller.movePage)
	})
	
	big.addEventListener("dragstart",function(estart){
		estart.stopPropagation();
		biandaAccesst.domWidth = dom.offsetWidth;
		biandaAccesst.statrX= estart.detail.touches[0].screenX;
		biandaAccesst.statrY= estart.detail.touches[0].screenY;
		dom.addEventListener("drag",imgContorller.bigPage)
	});
	big.addEventListener("dragend",function(e){
		dom.removeEventListener("drag",imgContorller.bigPage)
	})
	
	flip.addEventListener("dragstart",function(estart){
		estart.stopPropagation();
		biandaAccesst.domWidth = dom.offsetWidth;
		biandaAccesst.statrX= estart.detail.touches[0].screenX;
		biandaAccesst.statrY= estart.detail.touches[0].screenY;
		dom.addEventListener("drag",imgContorller.flipPage)
	});
	flip.addEventListener("dragend",function(e){
		dom.removeEventListener("drag",imgContorller.flipPage)
	})
	
	closedbtn.addEventListener("tap",function(e){
		imgContorller.closePage(dom);
	})
	rotating.addEventListener("tap",function(e){
		e.stopPropagation();
		imgContorller.rotatingPage(dom);
	})
}
/*图片清除*/
imgContorller.clear = function(e){
	e.stopPropagation();
	var editingDom = this.querySelector(".editing");
	var editingDoms = editingDom.querySelectorAll(".editStatusBtn");
	for(var i = 0 ; i < editingDoms.length ; i++){
		editingDoms[i].style.display = "none";
	}
	var imgInfoArr = setTietu();
	localStorage.setItem("tietu"+readnum,imgInfoArr);
	console.log(localStorage["tietu"+readnum])
	listenContorller.btnCtr(); 
	editingDom.classList.remove('editing')
}
/*图片显示*/
imgContorller.show = function(dom){
	listenContorller.btnCtr("un"); 
	var editingDoms = dom.querySelectorAll(".editStatusBtn");
	for(var i = 0 ; i < editingDoms.length ; i++){
		editingDoms[i].style.display = "block";
	}
	dom.classList.add('editing')
}
imgContorller.closePage = function(dom){
	dom.parentNode.removeChild(dom)
	listenContorller.btnCtr(); 
	statusFlag = 1;
//	listenContorller.inputImg();
}
imgContorller.flipPage = function(eing){ 
	var moveX = eing.detail.touches[0].screenX-biandaAccesst.statrX;
	var moveY = eing.detail.touches[0].screenY-biandaAccesst.statrY;
	this.style.webkitTransform='rotate('+Math.atan2(moveY,moveX) * 180 / Math.PI+'deg)' ;
}
imgContorller.bigPage = function(eing){ 
	var moveX = eing.detail.touches[0].screenX-biandaAccesst.statrX;
	var moveY = eing.detail.touches[0].screenY-biandaAccesst.statrY;
	moveX>0?moveX1 = moveX:moveX1 = -moveX
	moveY>0?moveY1 = moveY:moveY1 = -moveY
	moveX1-moveY1>0? t = moveX:t=moveY;
	this.style.width = biandaAccesst.domWidth+t+"px";		
	this.style.height = biandaAccesst.domWidth+t+"px";	
}
imgContorller.movePage = function(eing){
	var moveX = eing.detail.touches[0].screenX-imgAccesst.statrX;
	var moveY = eing.detail.touches[0].screenY-imgAccesst.statrY;
	this.style.left = imgAccesst.domx+moveX+"px";
	this.style.top = imgAccesst.domy+moveY+"px";
}
imgContorller.rotatingPage = function(_dom){
	imgInfo.rotateY = imgInfo.rotateY+180;
	_dom.querySelector(".map").style.webkitTransform ='rotateY('+imgInfo.rotateY+'deg)';
}
/*input搜索列表绑定事件*/
imgContorller.inputImg = function(){
	var inputimg = mui(".imgList ul li");
	var self = this;
	mui(".imgList").on("tap","li",function(){
		var src = this.children[0].src;
		var num = src.lastIndexOf("/");
		appendHTML(document.getElementById("btn"),baidu.template("editTemp",{_src: "../images/maps/"+src.substring(num+1,src.length)}))
		inputFoot.style.display = "none";
		imgContorller.show(document.getElementById("btn"));
		imgContorller.init();
	})
}
/*搜索列表显示*/
inputContorller.inputList = function(list){
	var index=""
	for(var i=0;i<list.length;i++){
		index+='<li><img src="../images/maps/'+mapsUrl[list[i]]+'"/></li>'
	}
	mui(".imgList ul")[0].innerHTML = index;
	imgContorller.inputImg();
	inputFoot.style.display = "block";
}
/*搜索匹配*/
inputContorller.search = function(text){
	var item=[];
	for (var i=0;i<mapsCn.length;i++) {
		if(mapsCn[i].indexOf(text) != -1){
			item.push(i)
		}
	}
	return item;
}


imgInfoContprller.initItem = function(){
	
}
imgInfoContprller.getItem = function(){
	
}
imgInfoContprller.setItem = function(){
	
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

function setTietu(){
	var domBox = mui("#btn div");
	var tietuArr=[];
	for (var i=0;i<domBox.length;i++) {
		var domImg = domBox[i].getElementsByClassName("map")[0];
				
		var imgSrc = domImg.src;
		var num = imgSrc.lastIndexOf("/");
		imgSrc = "../images/maps/"+imgSrc.substring(num+1,imgSrc.length)
		var imgLeft = domBox[i].offsetLeft;
		var imgtop = domBox[i].offsetTop;
		var imgWid = domBox[i].offsetWidth;
		var imgFlip = domImg.style.webkitTransform;
		var imgFlip2 = domBox[i].style.webkitTransform;
		var tietuInfo = [imgSrc,imgLeft,imgtop,imgWid,imgWid,imgFlip,imgFlip2];
		tietuArr.push(tietuInfo); 
	}
	return JSON.stringify(tietuArr);
}
function clearTietu(){
	var domBox = mui("#btn");
	domBox.innerHTML = "";
}

function initTietu(num){
	if(!localStorage["tietu"+num]){return}
	var arr = JSON.parse(localStorage["tietu"+num]);
	clearTietu();
	var domBox = mui("#btn")[0];
	var index=domBox.innerHTML;
	for (var i=0;i<arr.length;i++) {
		index += '<div class="changeImg editing">'+
			'<img src="../images/newImg/05_edit_del.png" class="closed editStatusBtn"/>'+
			'<img src="../images/newImg/06_edit_xuanzhuan.png" class="flip editStatusBtn"/>'+
			'<img src="../images/newImg/07_edit_control.png" class="big editStatusBtn"/>'+
			'<img src="../images/newImg/06_edit_symmetry.png" class="rotating editStatusBtn"/>'+			
			'<img src="'+arr[i][0]+'" class="map"/>'+  
			'</div>'
	}
	domBox.innerHTML = index;
	for (var i=0;i<arr.length;i++) {
		var domBox1 = mui("#btn div")[i];
		var domImg1 = domBox1.getElementsByClassName("map")[0];
		domBox1.style.left=arr[i][1]+"px";
		domBox1.style.top=arr[i][2]+"px";
		domBox1.style.width=arr[i][3]+"px";
		domBox1.style.height=arr[i][4]+"px";
		domImg1.style.webkitTransform=arr[i][6];
		domBox1.style.webkitTransform=arr[i][5];
	}
	imgContorller.init();
}