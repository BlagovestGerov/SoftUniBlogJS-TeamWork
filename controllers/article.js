const Article = require('mongoose').model('Article');
const Profession = require('mongoose').model('Profession');

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
        if (!articleArgs.profession){
            errorMsg = 'Invalid profession!';
        } else if (!articleArgs.age){
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

        if (errorMsg) {
            res.render('article/create', {error: errorMsg});
            return;
        }

        articleArgs.author = req.user.id;
        Article.create(articleArgs).then(article => {
            req.user.articles.push(article.id);
            req.user.save(err => {
                if (err){
                    res.redirect('/', {error : err.message});
                }else {
                    res.redirect('/');
                }
            });
        })
    },

    details: (req, res) => {
        let id = req.params.id;

        Article.findById(id).populate('author').then(article => {
            if (!req.user){
                res.render('article/details', { article: article, isUserAuthorized: false});
                return;
            }

            req.user.isInRole('Admin').then(isAdmin => {
                let isUserAuthorized = isAdmin || req.user.isAuthor(article);

                res.render('article/details', { article: article, isUserAuthorized: isUserAuthorized});
            });
        });
    },

    editGet: (req, res) => {
        let id = req.params.id;

        if(!req.isAuthenticated()){
            let returnUrl = `/article/edit/${id}`;
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

                res.render('article/edit', article)
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
        } else if (!articleArgs.profession) {
            errorMsg = 'Profession cannot be empty!'
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

        if(errorMsg) {
            res.render('article/edit', {error: errorMsg})
        } else {
            Article.update({_id: id}, {$set: {name: articleArgs.name, profession: articleArgs.profession, age: articleArgs.age, city: articleArgs.city, education: articleArgs.education, specialization: articleArgs.specialization, certifications: articleArgs.certifications, workplace: articleArgs.workplace, work: articleArgs.work, content: articleArgs.content, address: articleArgs.address, telephone: articleArgs.telephone}})
                .then(updateStatus => {
                    res.redirect(`/article/details/${id}`);
                })
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

        Article.findById(id).then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if (!isAdmin && !req.user.isAuthor(article)) {
                    res.redirect('/');
                    return;
                }

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

                    res.redirect('/');
                });
            });
        });
    }
};