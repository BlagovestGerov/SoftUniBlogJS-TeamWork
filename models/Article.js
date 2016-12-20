const mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
    name: {type: String, required: true},
    //profession: {type: String, required: true},
    profession: {type: mongoose.Schema.Types.ObjectId,required: true, ref:'Profession'},//-
    age: {type: String, required: true},
    city: {type: String, required: true},
    education: {type: String, required: true},
    specialization: {type: String, required: true},
    certifications: {type: String, required: true},
    workplace: {type: String, required: true},
    work: {type: String, required: true},
    content: {type: String, required: true},
    address: {type: String, required: true},
    telephone: {type: String, required: true},
    photo: {type: String, required: true},
    comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Comment' }],
    tags: [{type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tag'}],
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    date: {type: Date, default: Date.now()}
});


articleSchema.method({
    prepareInsert: function () {
        let User = mongoose.model('User');
        User.findById(this.author).then(user => {
            user.articles.push(this.id);
            user.save();
        });

        let Profession = mongoose.model('Profession');
        Profession.findById(this.profession).then(profession => {
            if (profession) {
                profession.articles.push(this.id);
                profession.save();
            }
        });

        let Tag = mongoose.model('Tag');
        for (let tagId of this.tags){
            Tag.findById(tagId).then(tag => {
                if (tag) {
                    tag.articles.push(this.id);
                    tag.save();
                }
            });
        }
    },

    prepareDelete: function () {
        let User = mongoose.model('User');
        User.findById(this.author).then(user => {
            if (user) {
                user.articles.remove(this.id);
                user.save();
            }
        });

        let Profession = mongoose.model('Profession');
        Profession.findById(this.profession).then(profession => {
            if (profession) {
                profession.articles.remove(this.id);
                profession.save();
            }
        });

        let Comment = mongoose.model('Comment');
        for (let comment of this.comments)
            Comment.findById(comment).then(comment => {
                comment.prepareDelete();
                comment.remove(this.id);
    });

        let Tag = mongoose.model('Tag');
        for (let tagId of this.tags){
            Tag.findById(tagId).then(tag => {
                if (tag) {
                    tag.articles.remove(this.id);
                    tag.save();
                }
            });
        }
    },

    deleteTag: function (tagId){
        this.tags.remove(tagId);
        this.save();
    }

});


const Article = mongoose.model('Article', articleSchema);

module.exports = Article;

// след като сме създали модела трябва да го добавим в datebase.js
