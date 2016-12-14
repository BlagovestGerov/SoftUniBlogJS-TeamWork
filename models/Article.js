const mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
    name: {type: String, required: true},
    profession: {type: String, required: true},
    age: {type: Number, required: true},
    city: {type: String, required: true},
    education: {type: String, required: true},
    specialization: {type: String, required: true},
    certifications: {type: String, required: true},
    workplace: {type: String, required: true},
    work: {type: String, required: true},
    content: {type: String, required: true},
    address: {type: String, required: true},
    telephone: {type: Number, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    //profession:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'Profession'},//-
    date: {type: Date, default: Date.now()}
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
