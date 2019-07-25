import {StudentsData} from '../../collections';

Meteor.publish('studentsData', function (){
  return StudentsData.collection.find();
});
