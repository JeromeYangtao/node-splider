const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//type:字段类型，包括String,Number,Date,Buffer,Boolean,Mixed,ObjectId,Array
//index:是否索引，注意唯一索引unique的写法
//default:默认值
const User = new Schema({
    "filename": { type: String, index:  {unique: true, dropDups: true} },
    "fileurl": { type: String, match: /\w+/, index: true },
    // "roles": { type: Array, default: [], index: true },
    // "magazines": { type: Array, default: [] },
    // "created": { type: Date, default: Date.now, index: true },
    "updated": { type: Date, default: Date.now, index: true },
});


const cNode = new Schema({
    "_id":{ type: String,default:Math.random()*Math.random()*Math.random()*100},
    "url": { type: String},
    "author":{type: String},
    "signature":{type: String},
    "title": { type: String ,unique: true},
    "comment": { type: String},
    // "magazines": { type: Array, default: [] },
    // "created": { type: Date, default: Date.now, index: true },
    "time": { type: Date, default: Date.now},
    // "updated": { type: String}
});
//使用middleware，每次保存都记录一下最后更新时间
cNode.pre('save', function(next){
    this.time = Date.now();
    next();
});

//创建模型
const model = mongoose.model('cNodeData', cNode);

module.exports = model;