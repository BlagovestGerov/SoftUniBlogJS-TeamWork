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
            res.render('admin/profession/create',professionArgs);
        }
        else{
            Profession.create(professionArgs).then(profession=>{
                res.redirect('/admin/profession/all');
            })
        }
    },

    editGet:(req,res)=>{
        let id=req.params.id;

        Profession.findById(id).then(profession=>{
            res.render('admin/profession/edit',{profession:profession});
        });
    },

    editPost:(req,res)=>{
        let id=req.params.id;

        let editArgs=req.body;

        if(!editArgs.name){
            let errorMessage='Profession name cannot be null';

            Profession.findById(id).then(profession=>{
                res.render('admin/profession/edit',{profession:profession,error:errorMessage});
            });
        }else{
            Profession.findOneAndUpdate({_id:id},{name:editArgs.name}).then(profession=>{
                res.redirect('/admin/profession/all');
            })
        }
    },
    deleteGet: (req, res) => {
        let id = req.params.id;

        Profession.findById(id).then(profession => {
            res.render('admin/profession/delete', {profession: profession});
        });
    },

    deletePost: (req, res) => {
        let id = req.params.id;

        Profession.findOneAndRemove({_id: id}).then(profession => {
            profession.prepareDelete();
            res.redirect('/admin/profession/all');
        });
    }
};

