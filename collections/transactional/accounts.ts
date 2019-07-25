import { MongoObservable } from 'meteor-rxjs';
import { TransactionAccount } from '../../server/models';

export const TransactionAccounts = new MongoObservable.Collection<TransactionAccount>('transaction_accounts');
