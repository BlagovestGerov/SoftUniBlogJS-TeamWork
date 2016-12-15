const mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
    name: {type: String, required: true},
    //profession: {type: String, required: true},
    profession: {type: mongoose.Schema.Types.ObjectId,required: true, ref:'Profession'},//-
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
    date: {type: Date, default: Date.now()}
});

//->
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
    },
});
//<-

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
