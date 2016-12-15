const mongoose=require('mongoose');
//const Article = mongoose.model('Article');

let professionSchema=mongoose.Schema(
    {
    name:{type:String,required:true,unique:true},
    articles: [{type: mongoose.Schema.Types.ObjectId, ref:'Article'}]
    }
);

professionSchema.method({
    prepareDelete:function(){
        let Article=mongoose.model('Article');
        for(let article of this.articles){
            Article.findById(article).then(article=>{
                article.prepareDelete();
                article.remove();
            })
        }
    }
});

professionSchema.set('versionKey',false);

const Profession=mongoose.model('Profession',professionSchema);

//module.exports = Profession;