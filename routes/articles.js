const express = require('express');
const Article = require('../models/article');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async(req, res)=>{
    try{
        const article = await Article.find();
        res.json(article);
    }catch(err){
        res.status(500).json({messege: err.messege});
    }
})

router.get('/new', (req, res)=>{
    res.render('articles/new',{article: new Article()});
})

router.get('/edit/:id', async(req, res)=>{
    const article = await Article.findById(req.params.id);
    res.render('articles/edit',{article: article});
})

router.get('/:slug', async(req, res)=>{
    // 6141809a46ee8273feed97bd
    // if( !mongoose.Types.ObjectId.isValid(req.params.id) ) return res.redirect('/');
    const article = await Article.findOne({ slug: req.params.slug});
    if (article === null) return res.redirect('/');
    res.render('articles/show',{article: article});
})

router.post('/', async (req, res, next)=>{
    req.article = new Article();
    next();
}, saveAndRedirect('new')) 

router.put('/:id', async(req, res, next)=>{
    req.article = await Article.findById(req.params.id);
    next();
}, saveAndRedirect('edit'))

router.delete('/:id', async(req, res)=>{
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

function saveAndRedirect(path){
    return async(req, res)=>{
    const {title, description, markdown} = req.body;

        let article = req.article;
        article.title= title
        article.description= description
        article.markdown= markdown

    try{
       article = await article.save();
       res.redirect(`/articles/${article.slug}`);
    }catch(err){
        res.render(`articles/${path}`,{article: article});
    }

    }
}

module.exports = router;