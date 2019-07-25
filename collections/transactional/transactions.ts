import { MongoObservable } from 'meteor-rxjs';
import { Transaction } from '../../server/models';

export const Transactions = new MongoObservable.Collection<Transaction>('transactions');
