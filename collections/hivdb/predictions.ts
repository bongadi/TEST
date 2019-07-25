import { MongoObservable } from 'meteor-rxjs';
import {Predition} from '../../server/models';

export const Predictions = new MongoObservable.Collection<Predition>('predictions');