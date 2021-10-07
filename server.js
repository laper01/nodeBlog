const express = require('express')
const mongoose = require('mongoose');
const articleRouter = require('./routes/articles');
const Article = require('./models/article');
const methodOverride = require('method-override');
const app = express();

mongoose.connect('mongodb://localhost/blog',{
    useNewUrlParser: true,
    useUnifiedTopology:true,
})

app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs')
app.use(methodOverride('_method'));

app.get('/', async(req, res)=>{
    const articles = await Article.find().sort({
        createdAt: "desc"
    }); 
    res.render('articles/index', {articles: articles});
})

app.use('/articles', articleRouter);

app.listen(5000,()=>{
    console.log("server is started")
})