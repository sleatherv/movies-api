const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

const { config } = require('./config/index');
const authApi = require('./routes/auth');
const moviesApi = require('./routes/movies.js')
const userMoviesApi = require('./routes/userMovies');
const { logErrors, errorHandler, wrapErrors } = require('./utils/middlewares/errorHandlers');
const notFoundHandler = require('./utils/middlewares/notFoundHandler');

//body parser
app.use(express.json());
app.use(helmet());
//enabling CORS
app.use(cors());

//routes
authApi(app);
moviesApi(app);
userMoviesApi(app);
// catch 404
app.use(notFoundHandler);

//Error middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Listening http://localhost:${config.port}`);
})