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
var listenContorller = {};
var imgContorller = {};
var searchWord;
var editor=false;

btnActive.addEventListener("tap",function(){
	btnUnable.style.display = "block";
	btnActive.style.display = "none";
	bluePerson.style.display = "block";
	audio1.play();
	setTimeout(listenContorller.listenWord,4000)
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
		alert("语音输入错误弹出二种方案")
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
	alert("语音搜索贴图："+searchWord);
	maps.src = "../images/newImg/v2_c0_fruit_g0_t0_tomato_xihongshi.png";
	changeImg.style.display = "block";
	editor=true;
	imgContorller.init();
}

var imgAccesst = {};
var biandaAccesst = {};
var xuanzhuanAccesst = {};


imgContorller.init = function(){
	newImg.addEventListener("tap",imgContorller.clear);
	imgBk.addEventListener("dragstart",function(e){
		e.stopPropagation();
		alert("对应单词");
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
imgContorller.closePage = function(){
	changeImg.style.display = "none";
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
