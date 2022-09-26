const express = require('express');
// const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./config/db/index');
const { handleError } = require('./app/middleware/middleware.error');
const app = express();
const port = process.env.PORT || 8000;
//import routes
const userRoutes = require('./app/routes/users.router');
const postRoutes = require('./app/routes/post.router');
//Middleware necessary
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(morgan('tiny'));

app.use(
   cors({
      credentials: true,
   })
);
app.use(cookieParser());
//Connect database
db.connect();
//Midleware router
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
// Middleware error
app.use(handleError);
//
app.listen(port);