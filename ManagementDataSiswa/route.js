const express = require('express')
const router = express.Router()
const path = require('path')


router.get('/tambah', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'add.html'))
})

router.get('/edit', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'edit.html'))
})

router.get('/detail', (req,res) => { 
    res.sendFile(path.join(__dirname, 'views', 'detail.html'))
})

module.exports = router