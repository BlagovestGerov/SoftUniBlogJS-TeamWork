const User = require('mongoose').model('User');

module.exports = {
    all: (req, res) => {
        User.find({}).then(users => {

            for (let user of users) {
                user.isInRole('Admin').then(isAdmin => {
                    user.isAdmin = isAdmin;
                });
            }

            res.render('admin/user/all', {users: users});
        });
    }
};