const mongoose = require('mongoose');
//This is making a shorthand to the mongoose.Schema function so we can refer to it as Schema:
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  //FIRST ARGUMENT:
  phone: {
    type: Number,
    min: 10, //min value
    max: 11, //max value
    required: true
  },
  duties: {
    type: Array,
    required: false,
    maxItems: 10,
    items: {
      type: String
    }
  },
  address: {
    type: String,
    required: true
  },
  yearsEmp: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  title: {
    type: String,
    required: true
  }
  
}, {
    //SECOND ARGUMENT:
    timestamps: true
});

//Creating Schema:
const resumeSchema = new Schema({
  name: {
      type: String,
      required: true,
      unique: true
  },
  description: {
      type: String,
      required: true
  },
  image: {
      type: String,
      required: true
  },
  skills: {
    type: Array,
    required: true,
    maxItems: 10,
    items: {
      type: String
    }
  },
  certificates: {
      type: String,
      required: false,
      min: 0
  },
  education: {
      type: String,
      default: false
  },
  job: [jobSchema]
}, {
  timestamps: true //created at and updated at
});

//Creating Model: 
//First argument: Capitalized and singular version of the collection you want to use for this model; Campsite for campsites collection
//Second argument: Schema we want to use for this collection) 
//Returns a constructor function (A de-sugared class)
//Used to instantiate documents for mondoDB
const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;