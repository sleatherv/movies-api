const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeysService = require('../services/apiKeys');

const { config } = require('../config/index');

//  Basic Strategy
require('../utils/auth/strategies/basic');

function authApi(app) {
    const router = express.Router();
    app.use('/api/auth', router);

    const apiKeysService = new ApiKeysService();

    router.post('/sign-in', async (req, res, next) => {

        const { apiKeyToken } = req.body;

        if (!apiKeyToken) {
            next(boom.unauthorized('apiKeyToken is required'), false);
        }
        passport.authenticate('basic', (err, user) => {
            try {
                if (err || !user) {
                    next(boom.unauthorized(), false);
                }

                req.login(user, { session: false }, async function (error) {
                    if (error) {
                        next(error);
                    }
                    // si no hay error procedemos a buscar nuestro API Key

                    const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

                    if (!apiKey) {
                        next(boom.unauthorized());
                    }

                    // teniendo en cuenta el API Key procedemos a construir nuestro JWT 

                    const {
                        _id: id,
                        name,
                        email
                    } = user;


                    const payload = {
                        sub: id,
                        name,
                        email,
                        scopes: apiKey.scopes
                    }

                    const token = jwt.sign(payload, config.authJwtSecret, {
                        expiresIn: '15m'
                    });

                    return res.status(200).json({ token, user: { id, name, email } })
                });

            } catch (err) {
                next(err)
            }
            // como es un custom Callback, debemos hace un Clousure con la firma de la ruta.
        })(req, res, next);


    })
}

module.exports = authApi;