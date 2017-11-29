const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//type:字段类型，包括String,Number,Date,Buffer,Boolean,Mixed,ObjectId,Array
//index:是否索引，注意唯一索引unique的写法
//default:默认值

const zhihuList = new Schema({
    "_id":{ type: String,default:Math.random()*Math.random()*Math.random()*100},
    "url": { type: String,unique: true},
    // "magazines": { type: Array, default: [] },
    // "created": { type: Date, default: Date.now, index: true },
    "time": { type: Date, default: Date.now},
    // "updated": { type: String}
});
//使用middleware，每次保存都记录一下最后更新时间
zhihuList.pre('save', function(next){
    this.time = Date.now();
    next();
});

//创建模型
const model = mongoose.model('zhihuList', zhihuList);

module.exports = model;