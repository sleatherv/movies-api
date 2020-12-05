const express = require('express');
const MoviesService = require('../services/movies');
const joi = require('@hapi/joi');
const { moviesMock } = require('../utils/mocks/movies');
const {
    movieIdSchema,
    createMovieSchema,
    updateMovieSchema
} = require('../utils/schemas/movies')
const cacheResponse = require('../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../utils/time');
const validationHandler = require('../utils/middlewares/validationHandler');

function moviesApi(app) {
    const router = express.Router();
    app.use("/api/movies", router);

    const movieServices = new MoviesService();

    router.get("/", async function (req, res, next) {
        cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
        const { tags } = req.query;
        try {
            const movies = await movieServices.getMovies({ tags });
            //throw new Error('Error getting movies')
            res.status(200).json({
                data: movies,
                message: 'movies listed'
            })
        } catch (err) {
            next(err);
        }
    });
    router.get("/:movieId", validationHandler({ movieId: movieIdSchema }, 'params'), async function (req, res, next) {
        cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
        const { movieId } = req.params;
        try {
            const movies = await movieServices.getMovie({ movieId });

            res.status(200).json({
                data: movies,
                message: 'movie retrieved'
            })
        } catch (err) {
            next(err);
        }
    });
    router.post("/", validationHandler(createMovieSchema), async function (req, res, next) {
        const { body: movie } = req;
        try {
            const movies = await movieServices.createMovie({ movie });

            res.status(201).json({
                data: movies,
                message: 'movie created'
            })
        } catch (err) {
            next(err);
        }
    });
    router.put("/:movieId", validationHandler({ movieId: movieIdSchema }, 'params'), validationHandler(updateMovieSchema), async function (req, res, next) {
        const { body: movie } = req;
        const { movieId } = req.params;
        try {
            const updatedMovieId = await movieServices.updateMovie({ movieId, movie });

            res.status(200).json({
                data: updatedMovieId,
                message: 'movie updated'
            })
        } catch (err) {
            next(err);
        }
    });
    router.delete("/:movieId", validationHandler({ movieId: movieIdSchema }, 'params'), async function (req, res, next) {
        const { movieId } = req.params;
        try {
            const deletedMovieId = await movieServices.deleteMovie({ movieId });

            res.status(200).json({
                data: deletedMovieId,
                message: 'movie deleted'
            })
        } catch (err) {
            next(err);
        }
    });
}


module.exports = moviesApi;