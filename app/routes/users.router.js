const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/users.controller')

router.post('/register', userControllers.register)
router.post('/login', userControllers.login)
router.get('/', userControllers.middlewareAuthor, userControllers.get)


module.exports = router