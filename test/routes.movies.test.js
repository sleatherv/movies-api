/*
  Haciendo test de las rutas.
  El assert verifica si es verdad la comparacion de los test.
  Proxyquire hace que cada vez que se haga un require, podamos elegir si
  traer el paquete real o traer un mock, los cuales nos ayudan a verificar si todo funciona
  correctamente.
*/
const assert = require('assert');
const proxyquire = require('proxyquire');

const { moviesMock, MoviesServicesMock } = require('../utils/mocks/movies.js');
const testServer = require('../utils/testServer');

/*
  Escribiendo los test,
  describe es lo que imprime la consola, y recibe como parametro
  un callback
*/
describe('router - movies', function () {
    const route = proxyquire('../routes/movies', {
        '../services/movie': MoviesServicesMock
    });

    const request = testServer(route);

    describe('GET /movies', function () {
        it('should respond with status 200', function (done) {
            request.get('/api/movies').expect(200, done);
        });

        it('Should respond with the list of the movies', function (done) {
            request.get('/api/movies').end((error, res) => {
                /*
                  Con deepEqual comparo objectos, en este caso
                  comparo la respuesta del body con la respuesta del moviesMock
                */
                assert.deepEqual(res.body, {
                    data: moviesMock,
                    message: 'Movies listed'
                });

                done();
            });
        });
    });

    describe('GET /movie', function () {
        it('should respond with a single movie', function (done) {
            const movieId = moviesMock[0].id;

            request.get(`/api/movies/${movieId}`).end((error, res) => {
                assert.deepEqual(res.body, {
                    data: moviesMock[0],
                    message: 'Movie retrieved'
                });

                done();
            });
        });
    });

    describe('POST /movie', function () {
        it('should respond with a movie id created', function (done) {
            request.post('/api/movies').send(moviesMock[1]).end((error, res) => {

                assert.deepEqual(res.body, {
                    data: moviesMock[0].id,
                    message: 'Movie created'
                });

                done();
            });
        });
    });

    describe('PUT /movie', function () {
        it('should respond with a movie id updated', function (done) {
            const movieId = moviesMock[0].id;
            const title = 'fast and furious';

            request.put(`/api/movies/${movieId}`).send({ title: title }).end((error, res) => {
                assert.deepEqual(res.body, {
                    data: moviesMock[0].id,
                    message: 'Movie updated'
                });

                done();
            });
        })
    });
});