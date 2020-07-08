const express = require('express');
const bodyParser = require('body-parser');

const resumeRouter = express.Router();
resumeRouter.use(bodyParser.json());

    // (/ is defining the route for promotions)
    resumeRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end('Will send the resume to you');
    })
    .post((req, res) => {
        res.end(`Will add the resume: ${req.body.name}`);
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /resume');
    })
    .delete((req, res) => {
        res.end('Deleting resume');
    });

module.exports = resumeRouter;