// Listen to incoming HTTP requests (can only be used on the server).
import {WebApp} from 'meteor/webapp';
import {Courses} from '../collections';
import {Predictions} from "../collections/hivdb";
import {Counts} from 'meteor/ros:publish-counts';

Meteor.publish('predictions.count', function({ }) {

  Counts.publish(this, 'predictions.count', Predictions.find());
});

WebApp.connectHandlers.use('/hello', (req, res, next) => {
  res.writeHead(200);
  res.end(`Hello world from: ${Meteor.release}`);
}).use('/courses', (req, res, next) => {

  res.writeHead(200);
  res.end(JSON.stringify(Courses.collection.find({}).fetch()));
}).use('/courses/id', (req, res, next) => {


  res.writeHead(200);
  res.end(JSON.stringify(Courses.collection.findOne({})));
});

