import {Transactions} from '../../collections';


Meteor.publish('transactions', function () {
  return Transactions.collection.find({});
});
