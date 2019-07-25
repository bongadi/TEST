
// Transactional

import {TransactionAccount} from '../models';
import {TransactionAccounts} from '../../collections';

Meteor.publish('transaction_accounts', function (): Mongo.Cursor<TransactionAccount> {
  return TransactionAccounts.collection.find({ownerId: Meteor.userId() });
});
