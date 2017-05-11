angular.module('chatApp')
	.factory('originalUsers', function($firebaseArray, $firebaseObject, FirebaseUrl){

		var usersRef = new Firebase(FirebaseUrl + 'users');
		var users = $firebaseArray(usersRef);

		var Users = {

			getProfile: function(uid){
				return $firebaseObject(usersRef.child(uid));
			},

			getDisplayNames: function(uid){
				return users.$getRecord(uid).displayName;
			},
			all: users,
			gravatar: function(uid){
				return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
			}
		};
		return Users;

	});
