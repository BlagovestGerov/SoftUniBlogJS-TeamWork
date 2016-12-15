const userController = require('./../controllers/user');
const articleController = require('./../controllers/article');
const homeController = require('./../controllers/home');
const adminController = require('./../controllers/admin/admin');

module.exports = (app) => {
    app.get('/', homeController.index);
    app.get('/profession/:id',homeController.listProfessionArticles);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.get('/article/create', articleController.createGet);
    app.post('/article/create', articleController.createPost);

    app.get('/article/details/:id', articleController.details);

    app.get('/article/edit/:id', articleController.editGet);
    app.post('/article/edit/:id', articleController.editPost);

    app.get('/article/delete/:id', articleController.deleteGet);
    app.post('/article/delete/:id', articleController.deletePost);

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

    app.get('/admin/profession/all', adminController.profession.all);//-

    app.get('/admin/profession/create', adminController.profession.createGet);//-
    app.post('/admin/profession/create', adminController.profession.createPost);//-
};

