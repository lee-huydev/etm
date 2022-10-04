const Favorites = require('../../models/favorites.model');
const jwt = require("jsonwebtoken");

class FavoritesController {
    middlewareAuthor(req, res, next) {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
        res.send(token)
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
    getAll(req, res, next) {
        Favorites.find({})
            .then(data => res.status(200).send(data))
            .catch(error => res.send(error));
    }
    getByCurrentUser(req, res) {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const claims = jwt.verify(token, process.env.SECRET_KEY)
        Favorites.find({currentUserId: claims._id})
            .then(data => res.send(data))
            .catch(err => res.send(err));
    }
    getByUsersId(req, res) {
        const currentUserId = req.query.currentUserId;
        Favorites.find({currentUserId})
            .then((data) => res.send(data))
            .catch((error) => res.send(error));
    }
    getByPostId(req, res) {
        const postId = req.query.postId;
        Favorites.find({postId})
            .then((data) => res.send(data))
            .catch((error) => res.send(error));
    }
    async postAdmin(req, res) {
        const newFavorite = await new Favorites({
            currentUserId: req.body.currentUserId,
            postId: req.body.postId
        });
        return await newFavorite
            .save()
            .then(() =>
                res.status(200).send({
                    message: 'successfully',
                    post: newFavorite,
                })
            )
            .catch((error) => res.status(400).send(error));
    }
    async post(req, res) {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const claims = jwt.verify(token, process.env.SECRET_KEY)
        const newFavorite = await new Favorites({
            currentUserId: claims._id,
            postId: req.body.postId
        });
        return await newFavorite
            .save()
            .then(() =>
                res.status(200).send({
                    message: 'successfully',
                    post: newFavorite,
                })
            )
            .catch((error) => res.status(400).send(error));
    }
    async deleteAdmin(req, res) {
        try {
            const _id = req.params;
            await Favorites.findByIdAndDelete(_id)
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
    async delete(req, res) {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            const claims = jwt.verify(token, process.env.SECRET_KEY)
            const _id = req.body.postId;
            await Favorites.findOneAndDelete({currentUserId:claims._id, postId:_id})
                .then((favorites) =>
                    res.status(200).send({
                        message: 'Delete successfully',
                        favorites,
                    })
                )
                .catch((error) => res.send(error));
        } catch (error) {
            res.status(404).send(error);
        }
    }
}

module.exports = new FavoritesController();
