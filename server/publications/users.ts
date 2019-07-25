import {Invitations, Users} from '../../collections';

Meteor.publish( 'users', function() {
  const isAdmin = Roles.userIsInRole( this.userId, ['manage-users', 'admin'], 'users');

  if ( isAdmin ) {
    return [
      Users.find( {}, { fields: { 'emails.address': 1, 'roles': 1 } } ),
      Invitations.find( {}, { fields: { 'email': 1, 'role': 1, 'date': 1 } } )
    ];
  } else {
    return null;
  }
});


