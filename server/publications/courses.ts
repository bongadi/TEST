import {Roles} from 'meteor/alanning:roles';
import {Chats, Courses, CourseSubjects, Messages} from '../../collections';
import {Course, CourseSubject} from '../models';

Meteor['publishComposite']('courses', function (): PublishCompositeConfig<Course> {
  const loggedInUser = Meteor.user();
  if (!this.userId) {
    return;
  }

  if (!loggedInUser) {
    throw new Meteor.Error(403, 'Authentication failed');
  }
  if (!Roles.userIsInRole(loggedInUser, ['tutor', 'manage-courses', 'view-courses', 'admin', 'super-admin'], Roles.GLOBAL_GROUP)) {
    throw new Meteor.Error(403, 'Access denied')
  }

    return {
      find: () => {
        return Courses.collection.find({ ownership: this.userId });
      },

      children: [
        {
          find: (course) => {
            return CourseSubjects.collection.find({courseId : course._id }, {
              sort: { createdAt: -1 },
              limit: 1
            });
          }
        }
        ]
  }
  });


Meteor.publish('subjects', function (): Mongo.Cursor<CourseSubject> {
  const loggedInUser = Meteor.user();

  if (!loggedInUser ||
    !Roles.userIsInRole(loggedInUser, ['tutor', 'manage-courses', 'view-courses', 'admin', 'super-admin'], 'courses')) {
    throw new Meteor.Error(403, 'Access denied')
  }
  return CourseSubjects.collection.find({courseId: loggedInUser._id});
});


