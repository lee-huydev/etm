const express = require('express');
const router = express.Router();
const postsController = require('../controllers/post.controller');

router.post(
   '/news',
   postsController.middlewareAuthor,
   postsController.middleWareAdmin,
   postsController.post
);
router.get('/relate', postsController.getPostRelate)
router.get('/', postsController.index);
router.get('/:_id', postsController.getById);
router.put(
   '/:_id',
   postsController.middlewareAuthor,
   postsController.middleWareAdmin,
   postsController.patch
);
router.delete(
   '/:_id',
   postsController.middlewareAuthor,
   postsController.middleWareAdmin,
   postsController.delete
);
module.exports = router;
