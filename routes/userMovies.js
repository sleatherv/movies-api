const express = require('express');

const UserMoviesService = require('../services/userMovie');
const validationHandler = require('../utils/middlewares/validationHandler');

const { movieIdSchema } = require('../utils/schemas/movies');
const { userIdSchema } = require('../utils/schemas/users');
const { createUserMovieSchema } = require('../utils/schemas/userMovies');

function userMoviesApi(app) {
    const router = express.Router();
    app.use('/api/user-movies', router);
    const userMoviesService = new UserMoviesService();

    router.get('/', validationHandler({ userId: userIdSchema }, 'query'),
        async function (req, res, next) {
            const { userId } = req.query;
            try {
                const userMovies = await userMoviesService.getUserMovie({ userId });
                res.status(200).json({
                    data: userMovies,
                    message: 'user movies listed'
                })
            } catch (error) {
                next(error)
            }
        });
    router.post('/', validationHandler(createUserMovieSchema), async function (req, res, next) {
        const { body: userMovie } = req;
        try {
            const createUserMovieId = await userMoviesService.createUserMovie({ userMovie });
            res.status(201).json({
                data: createUserMovieId,
                message: 'user movie created'
            });
        } catch (error) {
            next(error);
        }
    });
    router.delete('/:userMovieId', validationHandler({ userMovieId: movieIdSchema }, 'params'),
        async function (req, res, next) {
            const { userMovieId } = req.params;

            try {
                const deletedUserMovieId = await userMoviesService.deleteUserMovie({
                    userMovieId
                });
                res.status(200).json({
                    data: deletedUserMovieId,
                    message: 'user movie deleted'
                });
            } catch (error) {
                next(error);
            }
        });
};

module.exports = userMoviesApi;
