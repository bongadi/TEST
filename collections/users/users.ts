import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
import { User } from '../../server/models';

Meteor.users.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Meteor.users.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

export const Users = MongoObservable.fromExisting<User>(Meteor.users);
