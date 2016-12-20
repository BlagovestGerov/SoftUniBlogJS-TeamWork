const userController = require('./../controllers/user');
const articleController = require('./../controllers/article');
const homeController = require('./../controllers/home');
const adminController = require('./../controllers/admin/admin');
const tagController = require('./../controllers/tag');

module.exports = (app) => {
    app.get('/', homeController.index);
    app.get('/profession/:id',homeController.listProfessionArticles);

    app.get('/tag/:name', tagController.listArticlesByTag);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.get('/article/create', articleController.createGet);
    app.post('/article/create', articleController.createPost);

    app.get('/article/details/:id', articleController.details);
    app.post('/article/details/:id', articleController.commentPost);

    app.get('/article/edit/:id', articleController.editGet);
    app.post('/article/edit/:id', articleController.editPost);

    app.get('/article/delete/:id', articleController.deleteGet);
    app.post('/article/delete/:id', articleController.deletePost);


    // След този код всичко останало ще е видимо само за потребители, които са админи!
    // това е възможно след промените в app.use v express.js
    app.use((req, res, next) => {
        if (req.isAuthenticated()) {
            req.user.isInRole('Admin').then(isAdmin => {
                if(isAdmin) {
                    next();
                }else{
                    res.redirect('/');
                }
            })
        }else {
            res.redirect('/user/login');
        }
    });

    app.get('/admin/user/all', adminController.user.all);

    app.get('/admin/user/edit/:id', adminController.user.editGet);
    app.post('/admin/user/edit/:id', adminController.user.editPost);

    app.get('/admin/user/delete/:id', adminController.user.deleteGet);
    app.post('/admin/user/delete/:id', adminController.user.deletePost);

    app.get('/admin/profession/all', adminController.profession.all);

    app.get('/admin/profession/create', adminController.profession.createGet);
    app.post('/admin/profession/create', adminController.profession.createPost);

    app.get('/admin/profession/edit/:id', adminController.profession.editGet);
    app.post('/admin/profession/edit/:id', adminController.profession.editPost);

    app.get('/admin/profession/delete/:id', adminController.profession.deleteGet);
    app.post('/admin/profession/delete/:id', adminController.profession.deletePost);
};

