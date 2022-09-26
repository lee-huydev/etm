const Posts = require('../../models/post.model');
const jwt = require('jsonwebtoken');
class ProductsController {
   middlewareAuthor(req, res, next) {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
      try {
         req.myJwt = jwt.verify(token, process.env.SECRET_KEY);
         next();
      } catch (error) {
         res.status(404).send(error);
      }
   }
   middleWareAdmin(req, res, next) {
      const { admin, editor } = req.myJwt;
      if (admin || editor) {
         next();
      } else {
         res.status(401);
         throw Error('You are not access this function');
      }
   }
   async index(req, res) {
      // http://localhost:3000/api/products?keyword=sac-iphone&pageNumber=2
      // Fix số lượng sản phẩm hiển thị trên 1 trang
      const pageSize = 10;
      const page = Number(req.query.pageNumber) || 1;
      const keyword = req.query.keyword
         ? { name: { $regex: req.query.keyword } }
         : {};
      const countPosts = await Posts.countDocuments({ ...keyword });
      // giả sử có 20 sản phẩm, đang ở trang số 2, skip qua 10 sản phẩm đầu, chỉ lấy từ sản phẩm số 11 trở đi
      const posts = await Posts.find({ ...keyword })
         .limit(pageSize)
         .skip(pageSize * (page - 1))
      res.json({
         posts,
         countPosts,
         page,
      });
   }
   getById(req, res) {
      const _id = req.params;
      Posts.find(_id)
         .then((data) => res.send(data))
         .catch((error) => res.send(error));
   }
   async getPostRelate(req, res){
      // locahost:8000/gesdsdsd/?categories=chung-cu
      Posts.aggregate([{
            "$match": {
               "categories": req.query.categories,
            }
      }])
         .limit(5)
         .then((data) => {
            res.status(200)
            res.send(data)
         })
         .catch(error => {
            res.status(400)
            res.send(error)
         })
   }
   async post(req, res) {
      const newPost = await new Posts({
         user: req.myJwt._id,
         title: req.body.title,
         address: req.body.address,
         categories: req.body.categories,
         price: req.body.price,
         area: req.body.area,
         description: req.body.description,
         phoneNumber: req.body.phoneNumber,
         gallery: req.body.gallery,
         location: req.body.location,
         image: req.body.image,
         create_at: req.body.create_at
      });
      return await newPost
         .save()
         .then(() =>
            res.status(200).send({
               message: 'successfully',
               post: newPost,
            })
         )
         .catch((error) => res.status(400).send(error));
   }
   async patch(req, res) {
      try {
         const _id = req.params;
         const post = await Posts.findOne(_id);
         const keys = Object.keys(req.body);
         keys.forEach((key) => {
            post[key] = req.body[key];
         });
         await post
            .save()
            .then(() =>
               res.status(200).send({
                  message: 'sucessfully',
                  post,
               })
            )
            .catch((error) => res.status(401).send(error));
      } catch (error) {
         res.status(400).send(error);
      }
   }
   async delete(req, res) {
      try {
         const _id = req.params;
         await Posts.findByIdAndDelete(_id)
            .then((post) =>
               res.status(200).send({
                  message: 'Delete successfully',
                  post,
               })
            )
            .catch((error) => res.send(error));
      } catch (error) {
         res.status(404).send(error);
      }
   }
}

module.exports = new ProductsController();
