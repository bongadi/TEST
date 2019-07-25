import { MongoObservable } from 'meteor-rxjs';
import { TransactionReference } from '../../server/models';

export const TransactionReferences = new MongoObservable.Collection<TransactionReference>('references');
