var btnActive = mui(".btnActive")[0];
var btnUnable = mui(".btnUnable")[0];

var bluePerson = mui(".bluePerson")[0];

var audio1 = mui(".audio1")[0];
var audio2 = mui(".audio2")[0];

var changeImg = mui(".changeImg")[0];
var maps = mui(".map")[0];
var listenContorller = {};
var imgContorller = {};
var searchWord;

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
		alert( "语音识别失败："+e.message );
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

/*通过识别搜索*/
listenContorller.searchImg = function(){
	alert("语音搜索贴图："+searchWord);
	maps.src = "../images/newImg/v2_c0_fruit_g0_t0_tomato_xihongshi.png";
	changeImg.style.display = "block";
}

imgContorller.closePage = function(){
	
}
imgContorller.flipPage = function(){
	
}
imgContorller.bigPage = function(){
	
}
imgContorller.movePage = function(){
	
}
