var data = []
var readnum = 0;
var lockBtn = 0;
var resetLock = 0;
var sourceUrl = 'http://danci-app.b0.upaiyun.com/source/v2/';
var sourceVersion = 'v2';
var hz = '!thumb';
var cachePre = 'v21';

mui.plusReady(function() {
	//reset()
	data = getDatabase();

	mui.init({
		gestureConfig: {
			doubletap: true,
			swipeleft: true
		}
	});

	//加载数据
	loadData(function() {
		playWord();
	});

	//点击错误按钮
	mui('body').on('tap', '.wrongBtn', function() {
		//防止频繁点击按钮
		if(lockBtn == 1) {
			plus.nativeUI.toast('点击太频繁')
			return;
		}
		lockBtn = 1;
		setTimeout(function() {
			lockBtn = 0
		}, 1000);
		outWord();
	});

	//点击图片
	mui('body').on('tap', '.imageBar', function() {
		playWord();
	});

	//点击正确按钮
	mui('body').on('tap', '.answer .bar2', function() {
		//防止频繁点击按钮
		if(lockBtn == 1) {
			plus.nativeUI.toast('点击太频繁')
			return;
		}
		lockBtn = 1;
		setTimeout(function() {
			lockBtn = 0
		}, 1000);

		var obj = document.querySelector('.imageBar .image');
		var answer = obj.getAttribute('data-answer');
		if(answer == 1) {
			addScore();
			payRight(function() {
				setTimeout(function() {
					nextWord(function() {
						playWord();
					});
				}, 500);
			});
		} else {
			payWrong(function() {
				setTimeout(function() {
					nextWord(function() {
						playWord();
					});
				}, 500);
			});
		}
	});

});

//滑动显示单词
function outWord() {
	var obj = document.querySelector('.imageBar .image');
	var answer = obj.getAttribute('data-answer');
	if(answer != 1) {
		addScore(1);
		payRight(function() {
			setTimeout(function() {
				nextWord(function() {
					playWord();
				});
			}, 500);
		});
	} else {
		payWrong(function() {
			setTimeout(function() {
				nextWord(function() {
					playWord();
				});
			}, 500);
		});
	}
}
//下一个单词
function nextWord(callback) {
	mui.each(mui(".pic-container"),function(i,item){
		item.parentNode.removeChild(item);
	})
	readnum++;
	var elements = document.getElementsByClassName("changeImg");
	var d = data[readnum];
	if(!d) {
		reset();
	} else {
		setC('readnum', readnum);
		//debug(d[1])
		plus.nativeUI.showWaiting();
		download(d[1], function(src) {
			plus.nativeUI.closeWaiting();
			//debug(src);
			document.querySelector('.imageBar').innerHTML = '<div class="image" style="background-image: url(' + src + ');" data-file="' + d[2] + '" data-answer="' + d[3] + '"></div>';
			//回调函数
			callback ? callback() : "";
		});

	}
	setTimeout(function() {
		cacheSource(readnum);
	}, 300);
	if(elements.length == 0){return}
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

//判断是否正确
function question() {

}
//重置
function reset() {
	if(resetLock == 1) {
		debug('全部结束')
		return
	}
	resetLock = 1;

	localStorage.clear();
	document.querySelector('.imageBar').innerHTML = '<img src="" class="auto" data-file="" data-answer="" />';
	plus.nativeUI.confirm('恭喜您，全部学完！复习一下吧。', function() {
		setTimeout(function() {
			location.reload()
		}, 300);
	}, "", ["好的！"]);
	return;
}



//播放单词
function playWord(callback) {
	setTimeout(function() {
		var obj = document.querySelector('.imageBar .image');
		var url = obj.getAttribute('data-file');
		Mp3Url = url;
		document.getElementById("appmask").style.display = 'none';
		download(url, function(rsurl) {
			p = plus.audio.createPlayer(rsurl);
			p.play(function() {
				callback ? callback() : "";
			}, function(e) {
				debug(rsurl + ' 播放失败!')
			});
		})
	}, 300);
}

//播放正确声音
function payRight(callback) {
	p = plus.audio.createPlayer("_www/mp3/right.mp3");
	p.play(function() {
		callback ? callback() : "";
	}, function(e) {

	});
}

//播放错误声音
function payWrong(callback) {
	p = plus.audio.createPlayer("_www/mp3/wrong.mp3");
	p.play(function() {
		callback ? callback() : "";
	}, function(e) {

	});
}

//增加积分
function addScore(step) {
	var step = step ? step : 2;
	var obj = document.querySelector(".score");
	score = parseInt(obj.innerHTML);
	score = score + step;
	setC('score', score);
	obj.innerHTML = '<span style="color:red;font-size:20px;font-weight: bold;">+' + step + '</span>';
	setTimeout(function() {
		obj.innerHTML = score;
	}, 1000);

}

function debug(data) {
	if(typeof(data) == "object") {
		console.log(JSON.stringify(data));
	} else {
		console.log(data);
	}

}

//加载数据
function loadData(obj) {
	//加载之前的进度
	readnum = getC('readnum') ? parseInt(getC('readnum')) : 0;
	var d = data[readnum];
	download(d[1], function(src) {
		//debug(src)
		initTietu(d[2]);
		document.querySelector('.imageBar').innerHTML = '<div class="image" style="background-image: url(' + src + ');" data-file="' + d[2] + '" data-answer="' + d[3] + '"></div>';
		if(obj) {
			setTimeout(function() {
				obj();
			}, 2200);
		}
	});

	//加载分数
	var score = getC('score');
	score = score ? parseInt(score) : 101;
	document.querySelector(".score").innerHTML = score;
}

function getC(key) {
	key = cachePre + key;
	return localStorage.getItem(key);
}

function setC(key, value) {

	key = cachePre + key;
	localStorage.setItem(key, value);
}

//生成数据库,10个一组2个随机
function getDatabase() {
	db = getC('databases');
	if(db && db.length) {
		return JSON.parse(db);
	} else {
		setTimeout(function() {
			location.reload();
		}, 60000);
	}
	var url = sourceUrl + '/data.json';
	plus.nativeUI.showWaiting();
	mui.ajax(url, {
		dataType: 'json',
		type: 'get',
		complete: function(data) {
			debug('ajax error')
			plus.nativeUI.closeWaiting();
		},
		success: function(data) {
			plus.nativeUI.closeWaiting();
			var databases = [];
			for(var i = 0; i < data.length; i++) {

				//生成2个随机不重复的数r1,r2
				max = data[i].length -1;
				var r1 = parseInt(max * Math.random());
				var r2 = parseInt(max * Math.random());
				if(r1 == r2) {
					r2++;
					if(r2 > max) {
						r2 = 0;
					}
				}

				//取出两个随机内容
				str1 = data[i][r1][1];
				str2 = data[i][r2][1];

				//第一组为本地资源
				if(i == 0) {
					videoUrl1 = '../source/' + str1 + '.mp3';
					videoUrl2 = '../source/' + str2 + '.mp3';
					imageUrl1 = '../source/' + str1 + '.jpg';
					imageUrl2 = '../source/' + str2 + '.jpg';
				} else {
					//网络资源
					videoUrl1 = sourceUrl + str1 + '.mp3';
					videoUrl2 = sourceUrl + str2 + '.mp3';
					imageUrl1 = sourceUrl + str1 + '.jpg' + hz;
					imageUrl2 = sourceUrl + str2 + '.jpg' + hz;
				}

				for(j = 0; j < data[i].length; j++) {
					answer = 1;

					if(j == r1 || j == r2) {
						answer = 0;

					}
					if(i == 0) {
						imageUrl = '../source/' + data[i][j][1] + '.jpg';
						videoUrl = '../source/' + data[i][j][1] + '.mp3';
					} else {
						imageUrl = sourceUrl + data[i][j][1] + '.jpg' + hz;
						videoUrl = sourceUrl + data[i][j][1] + '.mp3';
					}
					//生成新数据库
					item = []
					item[0] = data[i][j][0];
					item[1] = imageUrl;
					//r1,r2音频交换
					if(j == r1) {
						item[2] = videoUrl2;
					} else if(j == r2) {
						item[2] = videoUrl1;
					} else {
						item[2] = videoUrl;
					}
					item[3] = answer;
					databases.push(item);
				}
				//显示混淆单词正确答案
				item = []
				item[0] = str1.replace('/[0-9]+/', '');
				item[1] = imageUrl1;
				item[2] = videoUrl1;
				item[3] = 1;
				databases.push(item);
				item = []
				item[0] = str2.replace('/[0-9]+/', '');
				item[1] = imageUrl2;
				item[2] = videoUrl2;
				item[3] = 1;
				databases.push(item);

			}
			setC('databases', JSON.stringify(databases));
			location.reload();
			return databases;
		}
	});
}
/*function getDatabase() {
	db = getC('databases');
	if(db && db.length) {
		return JSON.parse(db);
	} else {
		setTimeout(function() {
			location.reload();
		}, 5000);
	}
	plus.io.resolveLocalFileSystemURL("_www/source/data.json", function(entry) {
		entry.file(function(file) {
			var fileReader = new plus.io.FileReader();
			fileReader.readAsText(file, 'utf-8');
			fileReader.onloadend = function(evt) { 
				var data = JSON.parse(evt.target.result);
				var databases = [];
				for(i = 0; i < data.length; i++) {

					//生成2个随机不重复的数r1,r2
					max = data[i].length;
					var r1 = parseInt(max * Math.random());
					var r2 = parseInt(max * Math.random());
					if(r1 == r2) {
						r2++;
						if(r2 > max) {
							r2 = 0;
						}
					}

					//取出两个随机内容
					str1 = data[i][r1][1];
					str2 = data[i][r2][1];

					//第一组为本地资源
					if(i == 0) {
						videoUrl1 = '../source/' + str1 + '.mp3';
						videoUrl2 = '../source/' + str2 + '.mp3';
						imageUrl1 = '../source/' + str1 + '.jpg';
						imageUrl2 = '../source/' + str2 + '.jpg';
					} else {
						//网络资源
						videoUrl1 = sourceUrl + str1 + '.mp3';
						videoUrl2 = sourceUrl + str2 + '.mp3';
						imageUrl1 = sourceUrl + str1 + '.jpg' + hz;
						imageUrl2 = sourceUrl + str2 + '.jpg' + hz;
					}

					for(j = 0; j < data[i].length; j++) {
						answer = 1;

						if(j == r1 || j == r2) {
							answer = 0;

						}
						if(i == 0) {
							imageUrl = '../source/' + data[i][j][1] + '.jpg';
							videoUrl = '../source/' + data[i][j][1] + '.mp3';
						} else {
							imageUrl = sourceUrl + data[i][j][1] + '.jpg' + hz;
							videoUrl = sourceUrl + data[i][j][1] + '.mp3';
						}
						//生成新数据库
						item = []
						item[0] = data[i][j][0];
						item[1] = imageUrl;
						//r1,r2音频交换
						if(j == r1) {
							item[2] = videoUrl2;
						} else if(j == r2) {
							item[2] = videoUrl1;
						} else {
							item[2] = videoUrl;
						}
						item[3] = answer;
						databases.push(item);
					}
					//显示混淆单词正确答案
					item = []
					item[0] = str1.replace('/[0-9]+/', '');
					item[1] = imageUrl1;
					item[2] = videoUrl1;
					item[3] = 1;
					databases.push(item);
					item = []
					item[0] = str2.replace('/[0-9]+/', '');
					item[1] = imageUrl2;
					item[2] = videoUrl2;
					item[3] = 1;
					databases.push(item);

				}
				setC('databases', JSON.stringify(databases));
				return databases;
			}
		});
	}, function(e) {
		debug("数据加载出错: " + e.message);
	});
}*/

//下载资源
function download(url, obj) {
	if(!url) {
		debug('资源地址为空');
		return;
	}
	//非网络地址,跳过
	if(url.indexOf('http') == -1) {
		obj(url);
		return;
	}
	var tmp = url.split('/');
	var name = tmp[tmp.length - 1];
	var localpath = '_downloads/source/' + sourceVersion + '/' + name;
	var absolutepath = plus.io.convertLocalFileSystemURL(localpath); // 平台绝对路径
	//存在,
	plus.io.resolveLocalFileSystemURL(localpath, function(e) {
		plus.nativeUI.closeWaiting();
		//debug('本地,absolutepath=' + absolutepath);
		if(obj) {
			obj(absolutepath);
		}
	}, function(e) {
		//不存在,则下载 
		//debug('远程下载 ' + url)
		task = plus.downloader.createDownload(url, {
			filename: localpath // filename:下载任务在本地保存的文件路径
		}, function(d, status) {
			if(status == 200) {
				if(obj) {
					absolutepath = plus.io.convertLocalFileSystemURL(localpath); // 平台绝对路径
					obj(absolutepath);
				}
			} else {
				//下载失败,需删除本地临时文件,否则下次进来时会检查到图片已存在
				console.log("下载失败=" + absolutepath);
				task.abort(); //文档描述:取消下载,删除临时文件;(但经测试临时文件没有删除,故使用delFile()方法删除);
				if(absolutepath) {
					plus.io.resolveLocalFileSystemURL(absolutepath, function(entry) {
						entry.remove();
					});
				}
			}
		});
		task.start();
	});
	return absolutepath;
}

//缓存资源
function cacheSource(index, num) {
	var num = num ? num : 15;
	var len = data.length;

	var end = index + num;
	var end = end <= len ? end : len;
	for(i = index; i < end; i++) {
		var img = data[i][1];
		var mp3 = data[i][2];
		download(img, function(url) {})
		download(mp3, function(url) {})
	}
}