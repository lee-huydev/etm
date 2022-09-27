const express = require('express');
const router = express.Router();
const newController = require('../controllers/news.controller')


router.get('/', newController.get);
router.post('/', newController.middlewareAuthor ,newController.middleWareAdmin, newController.post)
router.delete('/_id',newController.middlewareAuthor, newController.middleWareAdmin, newController.delete)

module.exports = router;
