angular.module('chatApp')
.factory('Users',function($firebaseArray, $firebaseObject){

  let usersRef;
  let usersArray;

  var Users =  {
    connect:function(){
      console.log('connecting users');
      usersRef = firebase.database().ref('users');
      usersArray = $firebaseArray(usersRef);
      return usersArray;
    },
    getProfile: function(uid){
      var profile = $firebaseObject(usersRef.child(uid));
      return profile;
    },
    getDisplayName: function(uid){
      return usersArray.$getRecord(uid).displayName;
    },
    getAll:function(){
      return usersArray;
    },
    getGravatar: function(uid){
      return 'https://www.gravatar.com/avatar/' + usersArray.$getRecord(uid).emailHash+'?d=wavatar';
    },

  }

  return Users;
})
