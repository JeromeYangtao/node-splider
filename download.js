var fs=require('fs');
var setting = require("./setting.js");
var dir = './images/'+'/'+setting.questionId+'/';
var async = require("async");
let superagent = require("superagent");
let path = require("path");

require('./mongo/index.js')
var urlListModel=require('./model/urlList.js')

urlListModel.find({}).exec(function(err,users){
    download(users);
    // console.log(users.length);
})     
function download(urls){
    var count=0
    async.mapLimit(urls,5,function(url,callback){
        console.log("正在下载"+url.url);
        url=url.url.replace('_200x112','');
        superagent.get(url).end(function(err,res){
            if(res){
                // let fileName = path.basename( url.url );
                let fileName="pic"+(count++)+".jpg";
                fs.writeFile( dir + fileName, res.body, function( err ){
                    if( err ) {
                        console.log( err );
                    } else {
                        callback( null, fileName );
                    }
                })
            }
        })
    })
}
