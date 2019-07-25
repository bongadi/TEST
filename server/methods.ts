///<reference path="../node_modules/@types/meteor-roles/index.d.ts"/>
import {Chats, Courses, Predictions} from '../collections';
import { Messages } from '../collections';
import { MessageType, Profile } from './models';
import { check, Match } from 'meteor/check';
import { Promise } from 'meteor/promise';

const nonEmptyString = Match.Where((str) => {
  check(str, String);
  return str.length > 0;
});

const getStanfordURL = "https://hivdb.stanford.edu";
const timeout: any = 50000;

Meteor.methods({
  addChat(receiverId: string): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in to create a new chat');
    }

    check(receiverId, nonEmptyString);

    if (receiverId === this.userId) {
      throw new Meteor.Error('illegal-receiver',
        'Receiver must be different than the current logged in user');
    }

    const chatExists = !!Chats.collection.find({
      memberIds: { $all: [this.userId, receiverId] }
    }).count();

    if (chatExists) {
      throw new Meteor.Error('chat-exists',
        'Chat already exists');
    }

    const chat = {
      memberIds: [this.userId, receiverId]
    };

    Chats.insert(chat);
  }, 
  signup(username: string, password : string, email : string, fname: string, lname: string, imsi : string): string {
    check(username, nonEmptyString);
    check(password, nonEmptyString);
    check(email, nonEmptyString);
    check(fname, nonEmptyString);
    check(lname, nonEmptyString);
	
    const user = {
		username: username,
		email : email,
		password : password,
		profile: {
		  name : fname + " " + lname
		}
	}
	
	return Accounts.createUser(user);
 },
  removeChat(chatId: string): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in to remove chat');
    }
    check(chatId, nonEmptyString);
    const chatExists = !!Chats.collection.find(chatId).count();

    if (!chatExists) {
      throw new Meteor.Error('chat-not-exists',
        'Chat doesn\'t exist');
    }

    Chats.remove(chatId);
  },
  updateProfile(profile: Profile): void {
    if (!this.userId) { throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');
    }
    check(profile, {
      name: nonEmptyString
    });

    Meteor.users.update(this.userId, {
      $set: {profile}
    });
  },
  addRoleToUser(userId, role, group) {
    if (group) {
      Roles.addUsersToRoles(userId, role, group);
    } else {
      Roles.addUsersToRoles(userId, role);
    }
  },
  removeRoleFromUser(userId, role, group?) {
    if (group) {
      Roles.addUsersToRoles(userId, role, group);
    } else {
      Roles.addUsersToRoles(userId, role);
    }
  },
  addCourse(courseName, courseDescription) {
    if (!this.userId) { throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new course');
    }

    check(courseName, String);
    check(courseDescription, String);

    return {
      course: Courses.collection.insert({
        name: courseName,
        ownership: this.userId,
        description: courseDescription
      })
    };
  },
  addMessage(type: MessageType, chatId: string, content: string) {
    if (!this.userId) { throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');
    }

    check(type, Match.OneOf(String, [ MessageType.TEXT ]));
    check(chatId, nonEmptyString);
    check(content, nonEmptyString);

    const chatExists = !!Chats.collection.find(chatId).count();

    if (!chatExists) {
      throw new Meteor.Error('chat-not-exists',
        'Chat doesn\'t exist');
    }

    return {
      messageId: Messages.collection.insert({
        chatId: chatId,
        senderId: this.userId,
        content: content,
        createdAt: new Date(),
        type: type
      })
    };
  },
  countMessages(): number {
    return Messages.collection.find().count();
  },
  createSystemUser (email, password) {
    Accounts.createUser({email: password});
  },

  predict(body: any, isSequence? : boolean) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in to create a new request');
    }
    console.log('body', body);
    let bodyFormatted = {};
    let query = {};

    if(isSequence) {
      bodyFormatted = { "sequences": JSON.parse(body.sequences ) };   

      console.log(bodyFormatted);
      query = {
        operationName:"example"
        ,
         query : "query example($sequences: [UnalignedSequenceInput]!) {   viewer {     currentVersion { text, publishDate },     sequenceAnalysis(sequences: $sequences) {         inputSequence {         header,         sequence,         MD5,         SHA512       },       validationResults {         level,         message       },       absoluteFirstNA,       alignedGeneSequences {         gene {           name,           consensus,           length,           drugClasses {             name,             fullName,             drugs {               name,               displayAbbr,               fullName             }           },           mutationTypes         },         firstAA,         lastAA,         firstNA,         lastNA,         matchPcnt,         prettyPairwise {           positionLine,           refAALine,           alignedNAsLine,           mutationLine         },         mutations {           consensus,           position,           AAs,           triplet,           insertedNAs,           isInsertion,           isDeletion,           isIndel,           isAmbiguous,           isApobecMutation,           isApobecDRM,           hasStop,           isUnusual,           types,           primaryType,           comments {             triggeredAAs,             type,             text           },           text,           shortText         },         APOBEC: mutations(filterOptions: [APOBEC]) {           position,           AAs,           text         },         APOBEC_DRM: mutations(filterOptions: [APOBEC_DRM]) {           text         },         DRM: mutations(filterOptions: [DRM]) {           text         },         SDRM: mutations(filterOptions: [SDRM]) {           text         },         unusualMutations: mutations(filterOptions: [UNUSUAL]) {           text         },         treatmentSelectedMutations: mutations(           filterOptions: [PI_TSM, NRTI_TSM, NNRTI_TSM, INSTI_TSM]         ) {           text         },         frameShifts {           position,           isInsertion,           isDeletion,           size,           NAs,           text         }       },       firstTenCloseSubtypes: subtypesV2(first: 10) {         displayWithoutDistance,         distancePcnt,         referenceAccession       },       bestMatchingSubtype { display },       mixturePcnt,       mutations {         position,         AAs,         shortText       },       frameShifts {         text       },       drugResistance {         gene {           name,           consensus,           length,           drugClasses { name },           mutationTypes         },         drugScores {           drugClass {             name,             fullName,             drugs {               name,               displayAbbr,               fullName             }           },           drug { displayAbbr, fullName },           SIR,           score,           level,           text,           partialScores {             mutations {               text             },             score           }         },         mutationsByTypes {           mutationType,           mutations {             consensus,             position,             AAs,             triplet,             insertedNAs,             isInsertion,             isDeletion,             isIndel,             isAmbiguous,             isApobecMutation,             isApobecDRM,             hasStop,             isUnusual,             text,             shortText           }         }         commentsByTypes {           commentType,           comments {             type,             text,             highlightText           }         }       }         }   } }"
        ,
        variables : bodyFormatted
      };

    } else {
      bodyFormatted = {"mutations": JSON.parse(body.mutations )};

       query = {
        query: "query example($mutations:[String]!) {  viewer {    currentVersion { text, publishDate },    mutationsAnalysis(mutations: $mutations) {      validationResults {level,         message       },       drugResistance {         gene { name },         drugScores {           drugClass { name },           drug { name,displayAbbr,fullName},           SIR,           score,           level,           text,           partialScores {             mutations {               text             },             score           }         },         mutationsByTypes {           mutationType,           mutations {             text           }         }         commentsByTypes {           commentType,           comments {             text           }         }       }     }   } }"
        ,
        variables:  bodyFormatted 
      };

   }

    console.log(bodyFormatted);
    console.log(query);

    let theBody = JSON.stringify(query);

    const preditionRequest = {
      requestedBy: this.userId,
      request: theBody,
      response: 'PENDING',
      createdAt: new Date()
    };

    let predictionId = Predictions.collection.insert(preditionRequest);

    console.log('Save Prediction ' + predictionId);
    console.log('Sending ' + theBody);

    var options = {
      host: getStanfordURL,
      path: '/graphql',
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let fetch = require('node-fetch');

    let theResponse = '';

    Promise.await(
     theResponse = fetch(options.host + options.path, {
      method: options.method,
      headers: {'Content-Type': 'application/json'},
      body: theBody
    })
    .then(response => response.json())
    .then(response => response.data.viewer)
    .then(response => {

      //update response
     Predictions.collection.update(predictionId, {$set: {response : JSON.stringify(response)} });
      return response;

    })
    .catch(err => {
      return err;

    }));
    
    console.log(theResponse);

    return theResponse;
  }


});

