angular.module('chatApp')
	.factory('originalChannels', function($firebaseArray, FirebaseUrl){

		var ref = new Firebase(FirebaseUrl + 'channels');

		var channels = $firebaseArray(ref);

		return channels;

	});
