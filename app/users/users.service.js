angular.module('chatApp')
.factory('Users',function($firebaseArray, $firebaseObject){
  var usersRef = firebase.database().ref('users');
  var users = $firebaseArray(usersRef);
  var Users = {
    getProfile: function(uid){
      return $firebaseObject(usersRef.child(uid));
    },
    getDisplayName: function(uid){
      return users.$getRecord(uid).displayName;
    },
    all: users,
    getGravatar: function(uid){
      return 'https://www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash+'?d=wavatar';
    },
  };

  return Users;
})
