import {Predictions} from '../../collections';

Meteor.publish('predictions', function (){
	//Predictions.publish(this, 'total-predictions', Predictions.find());
  	return Predictions.find({});

});
