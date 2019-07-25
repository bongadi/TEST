import { MongoObservable } from 'meteor-rxjs';
import { Chat } from '../server/models';

export const Chats = new MongoObservable.Collection<Chat>('chats');
