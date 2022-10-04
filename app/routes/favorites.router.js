const express = require('express');
const router = express.Router();
const newController = require('../controllers/favorites.controller')

router.get('/getAll', newController.getAll);
router.get('/', newController.getByCurrentUser, newController.middlewareAuthor);
router.get('/getPosts', newController.getByUsersId);
router.get('/getUsers', newController.getByPostId);
router.post('/news' , newController.post, newController.middlewareAuthor)
router.post('/newsAdmin' , newController.postAdmin, newController.middlewareAuthor, newController.middleWareAdmin);
router.delete('/delete',newController.delete, newController.middlewareAuthor);
router.delete('/deleteAdmin/:_id', newController.deleteAdmin, newController.middlewareAuthor, newController.deleteAdmin);


module.exports = router;