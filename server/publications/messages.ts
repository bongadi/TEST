import {Message} from '../models';
import {Messages} from '../../collections';

Meteor.publish('messages', function (
  chatId: string,
  messagesBatchCounter: number): Mongo.Cursor<Message> {
  if (!this.userId || !chatId) {
    console.log('Invalid User!!!');
    return;
  }
  return Messages.collection.find({
    chatId
  }, {
    sort: {createdAt: -1},
    limit: 30 * messagesBatchCounter
  });
});
