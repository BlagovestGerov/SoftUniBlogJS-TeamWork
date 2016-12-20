const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const Profession = mongoose.model('Profession');
const Tag = mongoose.model('Tag');

module.exports = {
    index: (req, res) => {
        Profession.find({}).then(professions => {
            res.render('home/index',{professions: professions});
        })
    },

    listProfessionArticles:(req, res)=>{
        let id=req.params.id;

        Profession.findById(id).populate('articles').then(profession=>{
            User.populate(profession.articles,{path:'author'},err=>{
                if(err){
                    console.log(err.message);
                }

                Tag.populate(profession.articles, {path: 'tags'}, (err) =>{
                    if(err){
                        console.log(err.message);
                    }
                });

                res.render('home/article',{articles:profession.articles})
            });
        });
    }
};

/*module.exports = {
  index: (req, res) => {
      Article.find({}).limit(6).populate('author').then(articles => {
          res.render('home/index',{articles: articles});
      })
  }
};*/