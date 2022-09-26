const Users = require('../../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class UserControllers {
   middlewareAuthor(req, res, next) {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
      try {
         req.myJwt = jwt.verify(token, process.env.SECRET_KEY);
         next();
      } catch (error) {
         res.status(404).send(error);
      }
   }
   get(req, res) {
      try {
         Users.find({})
            .then((users) => res.send(users))
            .catch((error) => res.status(404).send(error));
      } catch (error) {
         res.status(404).send(error);
      }
   }
    async register(req, res) {
      console.log(req.body)
      const emailExits = await Users.findOne({ email: req.body.email });
      if (!emailExits) {
         const newUser = await new Users({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            admin: req.body.admin,
            editor: req.body.editor
         });
         return newUser
            .save()
            .then(() => {
               res.status(200).send({
                  message: 'successfully',
                  user: newUser,
               });
            })
            .catch((error) => {
               res.status(403).send({
                  message: 'failure',
                  error,
               });
            });
      } else {
         res.status(400).send({
            message: 'failure',
            error: 'Email already exist in systems',
         });
      }
   }
   async login(req, res) {
      const user = await Users.findOne({ email: req.body.email });
      if (!user) return res.status(404).send('User not found in systems');
      const password = await bcrypt.compareSync(
         req.body.password,
         user.password
      );
      if (!password)
         return res.status(400).json({
            status: "failure",
            message: 'Password incorrect, please try again!'
         });
      const token = jwt.sign(
         { email: user.email, _id: user._id, admin: user.admin, editor: user.editor },
         process.env.SECRET_KEY,
         { expiresIn: '1h' }
      );
      res.status(200).send({ token });
   }
}

module.exports = new UserControllers();
