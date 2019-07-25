import { MongoObservable } from 'meteor-rxjs';
import { Message } from '../server/models';

export const Messages = new MongoObservable.Collection<Message>('messages');
