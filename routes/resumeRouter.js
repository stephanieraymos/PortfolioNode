const express = require('express');
const bodyParser = require('body-parser');
const Resume = require('../models/resume');

const resumeRouter = express.Router();

resumeRouter.use(bodyParser.json());

resumeRouter.route('/')
.get((req, res, next) => { //next is for error handling
    Resume.find()
    .then(resume => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resume); //Sending json data to the client. Automatically closes the response stream afterward; so no res.end is needed
    })
    .catch(err => next(err)); //next(err) is passing off the error to the overall error handler so express can handle it.
})
.post((req, res, next) => {
    Resume.create(req.body) //Mongoose will let us know if we're missing any data in the request body
    .then(resume => {
        console.log('Resume Created ', resume); //Second argument; campsite: will log info about the resume to the console.
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resume); //Sends info about posted document to the client. (No res.end needed)
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /resume');
})
.delete((req, res, next) => {
    Resume.deleteMany() //Every document in resume collection will be deleted
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


resumeRouter.route('/:resume/job')
.get((req, res, next) => {
    Resume.findById(req.params.resumeId)//client is looking for a single resume's job; not all
    .then(resume => {
        if (resume) { //making sure non-null/truthy value was returned for the resume document
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resume.job); //accessing and returning the comments for this resume formatted in json
        } else {
            err = new Error(`Resume ${req.params.resumeId} not found`); 
            err.status = 404;
            return next(err); //Passing off error to express error handling mechanism 
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => { //This post request will be adding a new comment to the list of comments for a particular resume
    Resume.findById(req.params.resumeId)
    .then(resume => {
        if (resume) { //making sure non-null/truthy value was returned for the resume document
            resume.job.push(req.body); //pushing new job into the job array
            //This has only saved the job array that's in the applications memory; not the job sub document in the mongodb database
            resume.save() //to save this change to the mongodb database (lowercase because it's not static: it's being performed on this particular resume instance; the document itself)
            .then(resume => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resume);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Resume ${req.params.resumeId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /resume/${req.params.resumeId}/job`); //echoing back to the client: the path that they tried to reach
})
.delete((req, res, next) => {
    Resume.findById(req.params.resumeId)
    .then(resume => {
        if (resume) { //making sure non-null/truthy value was returned for the resume document
            for (let i = (resume.job.length-1); i >= 0; i--) { //Looping through and removing every job one at a time by its id
                resume.job.id(resume.job[i]._id).remove();
            }
            resume.save()
            .then(resume => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resume);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Resume ${req.params.resumeId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

resumeRouter.route('/:resumeId/job/:jobId')
.get((req, res, next) => {
    Resume.findById(req.params.resumeId)
    .then(resume => {
        if (resume && resume.job.id(req.params.jobId)) { //making sure non-null/truthy value was returned for the resume document & for the job
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resume.job.id(req.params.jobId));
        } else if (!resume) { //if resume was not found
            err = new Error(`Resume ${req.params.resumeId} not found`);
            err.status = 404;
            return next(err);
        } else { //if comment was not found
            err = new Error(`Job ${req.params.jobId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /resume/${req.params.resumeId}/job/${req.params.jobId}`);
})
.put((req, res, next) => { //this put request will update the text and rating fields of an existing comment
    Resume.findById(req.params.resumeId)
    .then(resume => {
        if (resume && resume.job.id(req.params.jobId)) { //making sure non-null/truthy value was returned for the resume document & for the job
            if (req.body.yearsEmp) { //if a new job yearsEmp has been passed in
                campsite.job.id(req.params.jobId).yearsEmp = req.body.yearsEmp; //then we'll set the yearsEmp for the specified job with that new yearsEmp
            }
            if (req.body.title) { //if a new job title has been passed in
                resume.job.id(req.params.jobId).title = req.body.title; //then we'll set the title for the specified job with that new title
            }
            campsite.save() //save updates to mongodb server
            .then(resume => { //if save operation succeeds
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resume);
            })
            .catch(err => next(err));
        } else if (!resume) {
            err = new Error(`Resume ${req.params.resumeId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Job ${req.params.jobId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Resume.findById(req.params.resumeId)
    .then(resume => {
        if (resume && resume.job.id(req.params.jobId)) {
            resume.job.id(req.params.jobId).remove(); //removing job
            resume.save()
            .then(resume => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resume);
            })
            .catch(err => next(err));
        } else if (!resume) {
            err = new Error(`Resume ${req.params.resumeId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Job ${req.params.jobId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = resumeRouter;