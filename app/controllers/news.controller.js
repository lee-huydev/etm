const News = require('../../models/news.model.js')
const jwt = require('jsonwebtoken');
class NewsController {
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
        const { admin } = req.myJwt;
        if (admin) {
           next();
        } else {
           res.status(401);
           throw Error('You are not access this function');
        }
     }
    get(req, res) {
        try {
            News.find({})
              .then((news) => res.send(news))
              .catch((error) => res.status(404).send(error));
        } catch (error) {
           res.status(404).send(error);
        }
     }
    async post(req, res) {
        const newPost = await new News({
            title: req.body.title,
            description: req.body.description,
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
      async delete(req, res) {
        try {
           const _id = req.params;
           await News.findByIdAndDelete(_id)
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

module.exports = new NewsController()