const express = require('express');
const bodyParser = require('body-parser');

const projectRouter = express.Router();
projectRouter.use(bodyParser.json());

projectRouter.route('/:projectId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end(`Will send details of the project: ${req.params.projectId} to you`);
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /projects/${req.params.projectId}`);
    })
    .put((req, res) => {
        res.write(`Updating the project: ${req.params.projectId}\n`);
        res.end(`Will update the project: ${req.body.name} with description: ${req.body.description}`);
    })
    .delete((req, res) => {
        res.end(`Deleting project: ${req.params.projectId}`);
    });

    projectRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end('Will send all the projects to you');
    })
    .post((req, res) => {
        res.end(`Will add the project: ${req.body.name} with description: ${req.body.description}`);
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /projects');
    })
    .delete((req, res) => {
        res.end('Deleting all projects');
    });

module.exports = projectRouter;