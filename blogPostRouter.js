const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const {BlogPosts} = require('./models')

BlogPosts.create('My First Post', 'This is my first post', 'Ossiggy', 'January 16th, 1990')
BlogPosts.create('How I took over the world', 'It was simple, really.', 'Ossiggy', 'Januray 16th, 2020')
BlogPosts.create('How I then took over the known universe', 'It was even easier', 'Ossiggy', 'January 16th, 2025')

router.get('/', (req, res) =>{
    res.json(BlogPosts.get())
})

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate']
    for(let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i]
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message)
            return res.status(400).send(message)
        }
    }
    const blogPost = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate)
    res.status(201).json(blogPost)
})

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id)
    console.log(`Deleted blog post \`${req.params.id}\``)
    res.status(204).end()
})

router.put('/:id', jsonParser, (req, res)=>{
    const requiredFields = ['title', 'content', 'author', 'publishDate']
    for(let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i]
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message)
            return res.status(400).send(message)
        }
    }
    
    if(req.params.id !== req.body.id){
            console.log('here')
            const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`)
                console.error(message)
                return res.status(400).send(message)
        }
        console.log(`Updating blog post \`${req.params.id}\``)
        const updatedBlogPost = BlogPosts.update({
            id: req.params.id,
            title: req.params.title,
            content: req.params.content,
            author: req.params.author,
            publishDate: req.params.publishDate
        })
        res.status(204).json(updatedBlogPost)
})

module.exports = router