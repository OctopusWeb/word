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
var big = mui(".big")[0];
var flip = mui(".flip")[0];
var imgBk = mui(".imgBk")[0];
var closedbtn = mui(".closed")[0]; 
var inputFoot = mui(".inputFoot")[0];
var inputSearchBtn = mui(".inputSearch")[0]
var listenContorller = {};
var imgContorller = {};
var searchWord;

btnActive.addEventListener("tap",function(){
	btnUnable.style.display = "block";
	btnActive.style.display = "none";
	bluePerson.style.display = "block";
	audio1.play();
	setTimeout(listenContorller.listenWord,4000)
});

inputSearchBtn.addEventListener("change",function(){
	imgContorller.inputList(imgContorller.search(this.value))
})

/*语音听写状态*/
listenContorller.listenWord = function(){
	var options = {};
	options.engine = 'iFly';
	text = "";
	plus.speech.startRecognize( options, function ( s ) {
		text+=s;
		if(s == "。"){
			searchWord = text;
			listenContorller.listenOver();
		}
	}, function ( e ) {
		listenContorller.listenErr();
	} );
	
}
/*语音听写状态2*/
listenContorller.listenWord2 = function(){
	var options = {};
	options.engine = 'iFly';
	text = "";
	plus.speech.startRecognize( options, function ( s ) {
		text+=s;
		if(s == "。"){
			searchWord = text;
			listenContorller.listenOver();
		}
	}, function ( e ) {
		audio1.play();
		setTimeout(function(){
			bluePerson1.style.display = "none";
			btnUnable.style.display = "none";
			btnActive.style.display = "block";
			listenContorller.inputImg();
		},2500)
		
	} );
	
}
/*语音识别完毕*/
listenContorller.listenOver = function(){
	audio2.play();
	setTimeout(function(){
		bluePerson.style.display = "none";
		listenContorller.searchImg();
	},2500)
}
/*识别错误*/
listenContorller.listenErr = function(){
	bluePerson.style.display = "none";
	bluePerson1.style.display = "block";
	audio3.play();
	setTimeout(function(){
		listenContorller.listenWord2();
	},3500)
}

/*通过识别搜索*/
listenContorller.searchImg = function(){
	var bol=false;
	var item = imgContorller.search(searchWord.substring(0,searchWord.length-1));
	if(item.length==1){
		maps.src = "../images/maps/"+mapsUrl[item[0]];
		bol = true;
		changeImg.style.display = "block";
		imgContorller.show();
		imgContorller.init();
	}else if(item.length==0){
		mui.toast('Sorry, no tag was found',{ duration:'short', type:'div' })
		btnUnable.style.display = "none";
		btnActive.style.display = "block";
	}else{
		imgContorller.inputList(item)
	}
}

listenContorller.inputImg = function(){
	inputFoot.style.display = "block";
}

var imgAccesst = {};
var biandaAccesst = {}; 
var xuanzhuanAccesst = {};


imgContorller.init = function(){
	newImg.addEventListener("tap",imgContorller.clear);
	imgBk.addEventListener("tap",function(e){
		e.stopPropagation();
		mui.toast('对应单词读音',{ duration:'short', type:'div' })
	})
	imgBk.addEventListener("dragstart",function(e){
		e.stopPropagation();
	})
	imgBk.addEventListener("longtap",function(e){
		e.stopPropagation();
		imgContorller.show();
	})
	changeImg.addEventListener("dragstart",function(estart){
		estart.stopPropagation();
		imgAccesst.domx = changeImg.offsetLeft;
		imgAccesst.domy = changeImg.offsetTop;
		imgAccesst.statrX= estart.detail.touches[0].screenX;
		imgAccesst.statrY= estart.detail.touches[0].screenY;
		changeImg.addEventListener("drag",imgContorller.movePage)
	});
	changeImg.addEventListener("dragend",function(e){
		changeImg.removeEventListener("drag",imgContorller.movePage)
	})
	
	big.addEventListener("dragstart",function(estart){
		estart.stopPropagation();
		biandaAccesst.domWidth = changeImg.offsetWidth;
		biandaAccesst.statrX= estart.detail.touches[0].screenX;
		biandaAccesst.statrY= estart.detail.touches[0].screenY;
		changeImg.addEventListener("drag",imgContorller.bigPage)
	});
	big.addEventListener("dragend",function(e){
		changeImg.removeEventListener("drag",imgContorller.bigPage)
	})
	
	flip.addEventListener("dragstart",function(estart){
		estart.stopPropagation();
		biandaAccesst.domWidth = changeImg.offsetWidth;
		biandaAccesst.statrX= estart.detail.touches[0].screenX;
		biandaAccesst.statrY= estart.detail.touches[0].screenY;
		changeImg.addEventListener("drag",imgContorller.flipPage)
	});
	flip.addEventListener("dragend",function(e){
		changeImg.removeEventListener("drag",imgContorller.flipPage)
	})
	
	closedbtn.addEventListener("tap",function(e){
		imgContorller.closePage();
	})
}

imgContorller.clear = function(e){
	e.stopPropagation();
	big.style.display = "none";
	flip.style.display = "none";
	closedbtn.style.display = "none";
	imgBk.style.display = "block";
	btnUnable.style.display = "none";
	btnActive.style.display = "block";
}
imgContorller.show = function(){
	big.style.display = "block";
	flip.style.display = "block";
	closedbtn.style.display = "block";
	imgBk.style.display = "none";
	btnUnable.style.display = "block";
	btnActive.style.display = "block";
}
imgContorller.closePage = function(){
	changeImg.style.display = "none";
	listenContorller.inputImg();
}
imgContorller.flipPage = function(eing){ 
	var moveX = eing.detail.touches[0].screenX-biandaAccesst.statrX;
	var moveY = eing.detail.touches[0].screenY-biandaAccesst.statrY;
	changeImg.style.transform ='rotate('+Math.atan2(moveY,moveX) * 180 / Math.PI+'deg)' ;
}
imgContorller.bigPage = function(eing){ 
	var moveX = eing.detail.touches[0].screenX-biandaAccesst.statrX;
	var moveY = eing.detail.touches[0].screenY-biandaAccesst.statrY;
	moveX>0?moveX1 = moveX:moveX1 = -moveX
	moveY>0?moveY1 = moveY:moveY1 = -moveY
	moveX1-moveY1>0? t = moveX:t=moveY;
	changeImg.style.width = biandaAccesst.domWidth+t+"px";		
	changeImg.style.height = biandaAccesst.domWidth+t+"px";	
}
imgContorller.movePage = function(eing){
	var moveX = eing.detail.touches[0].screenX-imgAccesst.statrX;
	var moveY = eing.detail.touches[0].screenY-imgAccesst.statrY;
	changeImg.style.left = imgAccesst.domx+moveX+"px";
	changeImg.style.top = imgAccesst.domy+moveY+"px";
}

imgContorller.inputImg = function(){
	var inputimg = mui(".imgList ul li");
	var self = this;
	this.bindEvent = function(i){
		inputimg[i].addEventListener("tap",function(){
			var src = this.getElementsByTagName("img")[0].src;
			var num = src.lastIndexOf("/");
			maps.src = "../images/maps/"+src.substring(num+1,src.length);
			inputFoot.style.display = "none";
			changeImg.style.display = "block";
			imgContorller.show();
			imgContorller.init();
		})
	}
	for (var i=0;i<inputimg.length;i++) {
		self.bindEvent(i);
	}
}
imgContorller.inputList = function(list){
	var index=""
	for(var i=0;i<list.length;i++){
		index+='<li><img src="../images/maps/'+mapsUrl[list[i]]+'"/></li>'
	}
	mui(".imgList ul")[0].innerHTML = index;
	imgContorller.inputImg();
	inputFoot.style.display = "block";
	changeImg.style.display = "none";
}
imgContorller.search = function(text){
	var item=[];
	for (var i=0;i<mapsCn.length;i++) {
		if(mapsCn[i].indexOf(text) != -1){
			item.push(i)
		}
	}
	return item;
}
