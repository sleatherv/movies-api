const express = require('express');
const cors = require('cors');
const app = express();

const { config } = require('./config/index');
const moviesApi = require('./routes/movies.js')

const { logErrors, errorHandler, wrapErrors } = require('./utils/middlewares/errorHandlers');
const notFoundHandler = require('./utils/middlewares/notFoundHandler');

//body parser
app.use(express.json());
//enabling CORS
app.use(cors());

//routes
moviesApi(app);
// catch 404
app.use(notFoundHandler);

//Error middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Listening http://localhost:${config.port}`);
})