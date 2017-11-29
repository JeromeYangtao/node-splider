
"use strict"; 
let async = require("async");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
var mkdirp = require('mkdirp');
var setting = require("./setting.js");
let fetch_data_get = require("./fetch.js").fetch_data_get;
let fetch_data_post = require("./fetch.js").fetch_data_post;
//本地存储目录
var dir = './images/'+'/'+setting.questionId+'/';
require('./mongo/index.js')
require('./model/index.js')
var zhihuList=require('./model/urlList.js')
//创建目录
mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});

// 存储所有图片链接的数组
let photos=[  ];
let count = 0;

// 获取首屏所有图片链接
function getInitUrlList(){
	fetch_data_get( setting.firstLink, {  } )
		.then(( result ) => {
			let $ = cheerio.load( result.text );
			let answerList = $( ".List-item" );
			answerList.map(function( i, answer ){
				let images = $( answer ).find( '.zh-lightbox-thumb' );
				// let images=$('.zh-lightbox-thumb');
				images.map(function( i, image ){
					// console.log(image);
					// if(image.indexOf('data')==-1)
					if($(image).attr( "src" ).indexOf('data')==-1)
					photos.push( $(image).attr( "src" ) );
				});
				// console.log(photos);
			});
			console.log( "成功抓取首屏 " + photos.length + " 张图片的链接" );
			getIAjaxUrlList( 20 );
		})
		.catch(( error ) => console.log( error ));
}
var answerList=[];
// 每隔300毫秒模拟发送ajax请求，并获取请求结果中所有的图片链接
function getIAjaxUrlList( offset ){
	fetch_data_post( setting.ajaxLink, setting.post_data_h + offset + setting.post_data_f, setting.header )
		.then(( result ) => {
			let response = JSON.parse( result.text );
			if( offset <= 20000 ) {
				// 把所有的数组元素拼接在一起
				let $ = cheerio.load(response.msg.join("") );
				let images = $(".origin_image" );
					images.map(function( i, image ){
						if($(image).attr( "src" ).indexOf('http')!=-1){
							var urlModel=new zhihuList({
								url:$(image).attr( "src" ) ,
								_id:Math.random()*Math.random()*Math.random()*1000,
							});
							urlModel.save(function(err){
								if(err) console.log(err);
							})
							console.log($(image).attr( "src" ));
							photos.push( $(image).attr( "src" ) );
						}
					});
				console.log(photos.length);
				setTimeout(function() {
					offset += 10;
					// console.log( "再次成功抓取 " + photos.length + " 张图片的链接" );
					getIAjaxUrlList( offset );
					// console.log(photos);
				}, setting.ajax_timeout)
			} else {
				console.log( "图片链接全部获取完毕，一共有" + photos.length + "条图片链接");
				// return downloadImg( setting.download_v );
			}
		})
		.catch(( error ) => console.log( error ));
}

setTimeout(function(){
	getInitUrlList();
},1000)
