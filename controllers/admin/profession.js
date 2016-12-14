const Profession=require('mongoose').model('Profession');

module.exports={
    all:(req,res) => {
        Profession.find({}).then(professions=> {
            res.render('admin/profession/all',{professions:professions});
        })
    },

    createGet:(req,res)=>{
        res.render('admin/profession/create');
    },

    createPost:(req,res)=>{
        let professionArgs=req.body;

        if(!professionArgs.name) {
            let errorMsg = 'Profession name cannot be null!';
            professionArgs.error = errorMsg;
            res.render('/admin/profession/all');
        }
        else{
            Profession.create(professionArgs).then(profession=>{
                res.redirect('/admin/profession/all');
            })
        }
    },
};

