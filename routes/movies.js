const express = require('express');
const MoviesService = require('../services/movies');

const { moviesMock } = require('../utils/mocks/movies');

function moviesApi(app) {
    const router = express.Router();
    app.use("/app/movies", router);

    const movieServices = new MoviesService();

    router.get("/", async function (req, res, next) {
        const { tags } = req.query;
        try {
            const movies = await movieServices.getMovies({ tags });

            res.status(200).json({
                data: movies,
                message: 'movie retrieved'
            })
        } catch (err) {
            next(err);
        }
    });
    router.get("/:movieId", async function (req, res, next) {
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
    router.post("/", async function (req, res, next) {
        const { body: movie } = req;
        try {
            const movies = await movieServices.createMovie({ movie });

            res.status(201).json({
                data: movies,
                message: 'movie Created'
            })
        } catch (err) {
            next(err);
        }
    });
    router.put("/:movieId", async function (req, res, next) {
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
    router.delete("/:movieId", async function (req, res, next) {
        const { movieId } = req.params;
        try {
            const deletedMovieId = await movieServices.updateMovie({ movieId });

            res.status(200).json({
                data: deletedMovieId,
                message: 'movies listed'
            })
        } catch (err) {
            next(err);
        }
    });
}


module.exports = moviesApi;