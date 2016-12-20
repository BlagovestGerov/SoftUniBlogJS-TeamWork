const Article = require('mongoose').model('Article');
const Profession = require('mongoose').model('Profession');
const Comment = require('mongoose').model('Comment');
const initializeTags = require('./../models/Tag').initializeTags;

module.exports = {
    createGet: (req, res) => {
        if (!req.isAuthenticated()){
            let returnUrl = '/article/create';
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        Profession.find({}).then(professions=> {
            res.render('article/create', {professions: professions});
        });
    },

    createPost: (req, res) => {
        if(!req.isAuthenticated()) {
            let returnUrl = '/article/create';
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        let articleArgs = req.body;

        let errorMsg = '';
        /*if (!articleArgs.profession){
            errorMsg = 'Invalid profession!';
        } else */if (!articleArgs.age){
            errorMsg = 'Invalid age!';
        }
        else if (!articleArgs.name){
            errorMsg = 'Invalid name!';
        }
        else if (!articleArgs.city){
            errorMsg = 'Invalid city!';
        }
        else if (!articleArgs.work) {
            errorMsg = 'Invalid working experience!';
        }
        else if (!articleArgs.specialization) {
            errorMsg = 'Invalid specialization!';
        }
        else if (!articleArgs.education) {
            errorMsg = 'Invalid education!';
        }
        else if (!articleArgs.content) {
            errorMsg = 'Invalid content!';
        }
        else if (!articleArgs.certifications) {
            errorMsg = 'Invalid certfications!';
        }
        else if (!articleArgs.workplace) {
            errorMsg = 'Invalid working place!';
        }
        else if (!articleArgs.address) {
            errorMsg = 'Invalid address!';
        }
        else if (!articleArgs.telephone) {
            errorMsg = 'Invalid telephone number!';
        }

        else if (!articleArgs.photo) {
            errorMsg = 'Invalid profile photo URL!';
        }

        if (errorMsg) {
            res.render('article/create', {error: errorMsg});
            return;
        }

        articleArgs.author = req.user.id;
        articleArgs.tags = [];
        Article.create(articleArgs).then(article => {
            // Get the tags from the input, split it by space or semicolon,
            // then remove empty entries.
            let tagNames = articleArgs.tagNames.split(/,/).filter(tag => {return tag});
            initializeTags(tagNames, article.id);
                article.prepareInsert();
            res.redirect('/');
            });
    },



    details: (req, res) => {
        // след натискане на бутона Read more ни се зареда адрес с ID на дадената статия, за да подскжем
        // на сървара какво точно трябва да ни върне използваме params функцията и променливата id приема
        // ид на статията
        let id = req.params.id;
        // след като знаем id на статията  я намираме и визоализираме
        Article.findById(id).populate('author tags').populate('comments').then(article => {
            Comment.find({}).populate('author').then(comments => {
                let d = [];
                for (let comment of comments) {
                    if (comment.article == id) {
                        d.push(comment);
                    }
                }
                // Правим проверка дали потребитея е админ или автор на статията, ако е едно от двете ще му визоализираме
                // бутончетата edin и delete във вюто.  в първия случай потребителя е неразпознат задаваме му стойностт
                // isUserAuthorized: false че не съществува.
                // Във втория случай правим проверка дали е админ или автор, ако е едно от двете му се присвоява стойнста и
                // isUserAuthorized става true. във вюто излиза ифнормацията като я въвеждаме {{#if isUserAuthorized}}
                if(!req.user) {
                    res.render('article/details', {article: article, isUserAuthorized: false, comments:d});
                    return;
                } else {
                    req.user.isInRole('Admin').then(isAdmin => {
                        let isUserAuthorized = isAdmin || req.user.isAuthor(article);
                        res.render('article/details', {article: article, isUserAuthorized: isUserAuthorized, comments:d});
                        return;
                    });
                }
            });
        })

    },

    commentPost: (req, res)=> {
        let id = req.params.id;
        let commentBody = req.body;

        commentBody.article = id;
        commentBody.like=0;
        commentBody.author = req.user.id;
        Comment.create(commentBody).then(comment => {
            comment.prepareInsert();
            res.redirect(`${id}`);
        })


    },

    editGet: (req, res) => {
        let id = req.params.id;

        if(!req.isAuthenticated()){
            let returnUrl = `/article/edit/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        Article.findById(id).populate('tags').then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if (!isAdmin && !req.user.isAuthor(article)) {

                    res.redirect('/');
                    return;
                }

                Profession.find({}).then(professions=> {
                    article.professions = professions;

                    article.tagNames = article.tags.map(tag => {return tag.name});
                    res.render('article/edit', article)
                });
            });
        });
    },

    editPost: (req, res) => {
        let id = req.params.id;

        if(!req.isAuthenticated()){
            let returnUrl = `/article/edit/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        let articleArgs = req.body;

        let errorMsg = '';
        if (!articleArgs.name){
            errorMsg = 'Name cannot be empty!';
        }
        else if (!articleArgs.age) {
            errorMsg = 'Age cannot be empty!'
        }
        else if (!articleArgs.city) {
            errorMsg = 'City cannot be empty!'
        }
        else if (!articleArgs.education) {
            errorMsg = 'University Degree cannot be empty!'
        }
        else if (!articleArgs.specialization) {
            errorMsg = 'Specialization cannot be empty!'
        }
        else if (!articleArgs.certifications) {
            errorMsg = 'Certifications cannot be empty!'
        }
        else if (!articleArgs.workplace) {
            errorMsg = 'Current working place cannot be empty!'
        }
        else if (!articleArgs.work) {
            errorMsg = 'Working experience cannot be empty!'
        }
        else if (!articleArgs.content) {
            errorMsg = 'About me cannot be empty!'
        }
        else if (!articleArgs.address) {
            errorMsg = 'Address cannot be empty!'
        }
        else if (!articleArgs.telephone) {
            errorMsg = 'Telephone number cannot be empty!'
        }
        else if (!articleArgs.photo) {
            errorMsg = 'Profile photo URL cannot be empty!'
        }

        if(errorMsg) {
            res.render('article/edit', {error: errorMsg})
        } else {

          Article.findById(id).populate('profession tags').then(article=>{
            if(article.profession.id!==articleArgs.profession){
               article.profession.articles.remove(article.id);
               article.profession.save();
            }

            article.profession=articleArgs.profession;
            article.name=articleArgs.name;
            article.age=articleArgs.age;
              article.city = articleArgs.city;
              article.education=articleArgs.education;
              article.specialization=articleArgs.specialization;
              article.certifications = articleArgs.certifications;
              article.workplace = articleArgs.workplace;
              article.work = articleArgs.work;
              article.content = articleArgs.content;
              article.address = articleArgs.address;
              article.telephone = articleArgs.telephone;
              article.photo = articleArgs.photo;

              let newTagNames = articleArgs.tags.split(/,/).filter(tag => {return tag});

              // Get me the old article's tags which are not
              // re-entered.
              let oldTags = article.tags
                  .filter(tag => {
                      return newTagNames.indexOf(tag.name) === -1;
                  });

              for(let tag of oldTags){
                  tag.deleteArticle(article.id);
                  article.deleteTag(tag.id);
              }

              initializeTags(newTagNames, article.id);
            article.save((err)=>{
                if(err){
                    console.log(err.message);
                }
                Profession.findById(article.profession).then(profession=>{
                    if(profession.articles.indexOf(article.id)===-1){
                        profession.articles.push(article.id);
                        profession.save();
                    }

                    res.redirect(`/article/details/${id}`);
                })
            });
          });
        }
    },

    deleteGet: (req, res) => {
        let id = req.params.id;

        if(!req.isAuthenticated()){
            let returnUrl = `/article/delete/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        Article.findById(id).populate('category tags').then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if (!isAdmin && !req.user.isAuthor(article)) {
                    res.redirect('/');
                    return;
                }

                article.tagNames = article.tags.map(tag => {return tag.name});
                res.render('article/delete', article)
            });
        });
    },


    deletePost: (req, res) => {
        let id = req.params.id;

        if(!req.isAuthenticated()){
            let returnUrl = `/article/delete/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        Article.findById(id).then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if (!isAdmin && !req.user.isAuthor(article)) {
                    res.redirect('/');
                    return;
                }

                Article.findOneAndRemove({_id: id}).then(article => {

                    article.prepareDelete();
                    res.redirect('/');
                });
            });
        });
    }
};