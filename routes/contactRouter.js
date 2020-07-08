const express = require('express');
const bodyParser = require('body-parser');

const contactRouter = express.Router();
contactRouter.use(bodyParser.json());

    contactRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end('Will send the contact information to you')
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /contact');
    })

module.exports = contactRouter;