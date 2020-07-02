const express = require('express');
const router = express.Router();

const db = require('../data/db')

router.post("/", function(req, res) {
    const { title, contents } = req.body
    console.log(req.body)
    if( !title || !contents ){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }else{
        db.insert(req.body)
            .then(post =>{
                res.status(201).json(post)
            })
            .catch(err =>{
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            })
    }
})

router.post("/:id/comments", function(req, res) {
    const id = req.params.id
    const comment = { ...req.body, post_id: id };
    if(!comment.text){
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }else {
        db.findById(id)
        .then(post =>{
            if(post){
                db.insertComment(comment)
                .then(comment =>{
                    res.status(201).json(comment)
                })
                .catch(err =>{
                    res.status(500).json({ error: "There was an error while saving the comment to the database" })
                })
            }else{
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err =>{
            res.status(500).json({ message: "There was an error while saving the comment to the database" })
        })
    }
    
})

router.get('/', function(req, res) {
    db.find()
        .then(posts =>{
            res.status(200).json(posts)
        })
        .catch(err =>{
            res.status(500).json({error: "The posts information could not be retrieved."})
        })
})

router.get('/:id', function(req, res) {
    // const id = req.params.id
    const { id } = req.params
    db.findById(id)
        .then(post =>{
            if(post) {
                res.status(200).json(post)
            }else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err =>{
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

router.get('/:id/comments', function(req, res) {
    const { id } = req.params
    db.findPostComments(id)
        .then(comments =>{
            if(comments.length) {
                res.status(200).json(comments)
            }else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err =>{
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

router.delete('/:id', function(req, res) {
    const { id } = req.params
    db.remove(id)
        .then(post =>{
            if(post){
                res.status(400).json(post)
            }else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err =>{
            res.status(500).json({ error: "The post could not be removed" })
        })
})

router.put('/:id', function(req, res) {
    const { id } = req.params
    const post = { ...req.body }
    if(!post.title || !post.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }else{
        db.update(id, post)
        .then(post =>{
            if(post) {
                res.status(200).json(post)
            }else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err =>{
            res.status(500).json({ error: "The post information could not be modified." })
        })
    }
        
})
module.exports = router; 