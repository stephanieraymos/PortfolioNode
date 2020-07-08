const express = require('express');
const bodyParser = require('body-parser');

const aboutRouter = express.Router();
aboutRouter.use(bodyParser.json());

    aboutRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end('Will send the about information to you')
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /about');
    })

module.exports = aboutRouter;