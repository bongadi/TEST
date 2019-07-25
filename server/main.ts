import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import {Users} from "../collections/users";
function countActive () {
  return 0;
}
function insert (tx) {
  console.log('custom method :tx insert simulated.' + tx.status);
  return true;
}
function exists () {
  console.log('custom method :tx insert simulated.');
  return true;
}

Meteor.startup(() => {
  //console.log(Accounts);
  //Accounts._bcryptRounds = 10;

  if (Meteor.settings) {
    //Object.assign(Accounts._options, Meteor.settings['accounts-phone']);
    // SMS.twilio = Meteor.settings['twilio'];
  }

  if (Users.collection.find().count() > 0) {
    return;
  }

});

