angular.module('chatApp',['ui.router','firebase','angular-md5'])
.run(function($rootScope, $state, $transitions, $trace){
  //$trace.enable('TRANSITION');
  // $state.defaultErrorHandler(function(error) {
  //   console.log('default error');
  // });

  $transitions.onBefore({to:function(state){
      var nonAuth = ['home','login','register']
      return nonAuth.includes(state.name)
    }},
    function(trans) {
      console.log(trans.to().name+ ' is non-Auth');
      var Auth = trans.injector().get('Auth');
      return Auth.$requireSignIn().then(function(auth){
        return trans.router.stateService.target('channels');
      }).catch(function(err){

      })
    });
  $transitions.onBefore({}, function(trans) {
    var nonAuth = ['home','login','register']
    if(!nonAuth.includes(trans.$to().name) ){
      console.log(trans.$to().name + ' is Auth required');
      var Auth = trans.injector().get('Auth');
      return Auth.$requireSignIn().then(function(auth){
        if(trans.$to().name !== 'profile'){
          var Users = trans.injector().get('Users');
          return Users.connect().$loaded().then(function(usersArray){
            return Users.getProfile(auth.uid).$loaded().then(function(profile){
              if(!profile.displayName){
                return trans.router.stateService.target('profile');
              } else {
                return true
              }
            })
          })
        } else {
          return true
        }
      }).catch(function(err){
        return trans.router.stateService.target('home');
      })
    }
  });
  $transitions.onError({}, function(trans){
    console.log(trans.error());
  })
})
.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: 'home/home.html'
  })
  .state('channels',{
    url:'/channels',
    controller:'channelsCtrl as channelsCtrl',
    templateUrl:'channels/channelsIndex.html',
    resolve:{
      channels: function(Channels){
        return Channels.connect().$loaded();
      },
      profile:function($state,Auth,Users){
        return Users.getProfile(Auth.$getAuth().uid).$loaded().then(function(profile){
          return profile;
        });
      }
    }
  })
  .state('channels.direct', {
    url:'/{uid}/messages/direct',
    templateUrl:'channels/messages.html',
    controller:'messagesCtrl as messagesCtrl',
    resolve: {
      messages: function($stateParams, Messages, profile){
        return Messages.forUsers($stateParams.uid, profile.$id).$loaded()
      },
      channelName: function($stateParams, Users){
        return Users.connect().$loaded().then(function(usersArray){
          return 'chatting with @'+Users.getDisplayName($stateParams.uid);
        })
      }
    }
  })
  .state('channels.messages',{
    url:'/{channelId}/messages',
    templateUrl:'channels/messages.html',
    controller:'messagesCtrl as messagesCtrl',
    resolve:{
      messages:function($stateParams, Messages){
        return Messages.forChannel($stateParams.channelId).$loaded();
      },
      channelName: function($stateParams, channels){         // channels is inherited from 'channels' state. it's not the Channels service.
        return '#'+channels.$getRecord($stateParams.channelId).name;
      }
    }
  })
  .state('login', {
    url: '/login',
    controller: 'authCtrl as authCtrl',
    templateUrl: 'auth/login.html'
  })
  .state('register', {
    url: '/register',
    controller: 'authCtrl as authCtrl',
    templateUrl: 'auth/register.html'
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'users/profile.html',
    controller:'profileCtrl as profileCtrl',
    resolve: {
      profile: function(Users, Auth){
        return Auth.$requireSignIn().then(function(auth){
          return Users.connect().$loaded(function(usersArray){
            return Users.getProfile(auth.uid).$loaded();
          })
        });
      },
      auth:function(Auth){
        return Auth.$getAuth();
      }
    }
  })
  .state('channels.create',{
    url:'/create',
    templateUrl:'channels/create.html',
    controller:'channelsCtrl as channelsCtrl'
  })

  $urlRouterProvider.otherwise('/home');

  var config = {
    apiKey: "AIzaSyCyJCB-trnwWZ8KNB1fZIMj3tFwFyZzdoA",
    authDomain: "chatapp-7bcfc.firebaseapp.com",
    databaseURL: "https://chatapp-7bcfc.firebaseio.com",
    projectId: "chatapp-7bcfc",
    storageBucket: "chatapp-7bcfc.appspot.com",
    messagingSenderId: "905240895252"
 };
 firebase.initializeApp(config);
})

 // config2(function ($stateProvider, $urlRouterProvider) {
 //    $stateProvider
 //      .state('home', {
 //        url: '/',
 //        templateUrl: 'home/home.html',
 //        resolve: {
 //          requireNoAuth: function($state , Auth){
 //            return Auth.$requireAuth().then(function(auth){
 //              $state.go('channels');
 //            }, function(error){
 //              return
 //            });
 //          }
 //        }
 //      })
 //      .state('login', {
 //        url: '/login',
 //        controller: 'AuthCtrl as authCtrl',
 //        templateUrl: 'auth/login.html',
 //        controller: 'AuthCtrl as authCtrl',
 //        resolve: {
 //          requireNoAuth: function($state, Auth){
 //            return Auth.$requireAuth().then(function(auth){
 //              var userEmail = auth.password.email;
 //              console.log('user ' + userEmail + ' has no need to login');
 //              $state.go('home');
 //            }, function(error){
 //              return;
 //            });
 //          }
 //        }
 //      })
 //      .state('register', {
 //        url: '/register',
 //        controller: 'AuthCtrl as authCtrl',
 //        templateUrl: 'auth/register.html',
 //
 //        controller: 'AuthCtrl as authCtrl',
 //
 //        resolve: {
 //          requireNoAuth: function($state, Auth){
 //            return Auth.$requireAuth().then(function(auth){
 //
 //              var userEmail = auth.password.email;
 //
 //              console.log('user ' + userEmail +' has no need to register');
 //              $state.go('home');
 //            }, function(error){
 //              return;
 //            });
 //          }
 //        }
 //      })
 //      .state('profile', {
 //          url: '/profile',
 //          templateUrl: 'users/profile.html',
 //          controller: 'ProfileCtrl as profileCtrl',
 //          resolve: {
 //            auth: function($state, Users, Auth){
 //              console.log('PROFILE: checking if the user is authenticated...');
 //              return Auth.$requireAuth().catch(function(){
 //                console.log('user is NOT authenticated so we are going HOME');
 //                $state.go('home');
 //              });
 //            },
 //            profile: function(Users, Auth){
 //              console.log('getting the users profile...');
 //              return Auth.$requireAuth().then(function(auth){
 //                //$loaded() is a function from $firebaseArray that returns a promise resolved
 //                //  when data is available locally
 //                return Users.getProfile(auth.uid).$loaded();
 //            });
 //          }
 //        }
 //      }).
 //      state('channels', {
 //        url: '/channels',
 //        templateUrl: 'channels/index.html',
 //        controller: 'ChannelsCtrl as channelsCtrl',
 //        resolve: {
 //          channels: function(Channels){
 //            return Channels.$loaded();
 //          },
 //          profile: function($state, Auth, Users){
 //            return Auth.$requireAuth().then(function(auth){
 //              return Users.getProfile(auth.uid).$loaded().then(function(profile){
 //                if (profile.displayName){
 //                  return profile;
 //                } else {
 //                  $state.go('profile');
 //                }
 //              });
 //            }, function(error){
 //              $state.go('home');
 //            });
 //          }
 //        }
 //      }).
 //      state('channels.create', { //this is a child state of the channels state
 //        url: '/create',
 //        templateUrl: 'channels/create.html',
 //        controller: 'ChannelsCtrl as channelsCtrl'
 //
 //      }).
 //      state('channels.messages',{ //child state of channels
 //        url: '/{channelId}/messages', //URL has the channelId parameter
 //        controller: 'MessagesCtrl as messagesCtrl',
 //        templateUrl: 'channels/messages.html',
 //        resolve: {
 //          messages: function($stateParams, Messages){ //we acccess the param via $stateParams provided by ui-router
 //            return Messages.forChannel($stateParams.channelId).$loaded();
 //          },
 //          channelName: function($stateParams, channels){ //channels dependency injected from the channels parent state
 //            return '#'+channels.$getRecord($stateParams.channelId).name;
 //          }
 //        }
 //      }).
 //      state('channels.direct', {
 //        url: '/{uid}/messages/direct',
 //        templateUrl: 'channels/messages.html',
 //        controller: 'MessagesCtrl as messagesCtrl',
 //        resolve : {
 //          messages: function($stateParams, Messages, profile){
 //            return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
 //          },
 //          channelName: function($stateParams, Users){
 //            return Users.all.$loaded().then(function(){
 //              return '@' + Users.getDisplayName($stateParams.uid);
 //            });
 //          }
 //        }
 //      });
 //
 //    $urlRouterProvider.otherwise('/');
 //  })

angular.module('chatApp')
.controller('authCtrl',function($scope, Auth, $state){
  var authCtrl = this;

  authCtrl.user = {
    email: '',
    password: ''
  };

  authCtrl.login=function(){
    Auth.$signInWithEmailAndPassword(authCtrl.user.email,authCtrl.user.password).then(function(auth){
      $state.go('home')
    }, function(err){
      authCtrl.error = err;
    })
  }

  authCtrl.register = function (){
    Auth.$createUserWithEmailAndPassword(authCtrl.user.email, authCtrl.user.password).then(function (user){
      $state.go('home');
    }, function (error){
      authCtrl.error = error;
    });
  };
})

angular.module('chatApp')
.factory('Auth',function($firebaseAuth){
  var auth = $firebaseAuth();

  return auth;
})

angular.module('chatApp')
.controller('channelsCtrl',function($state, Auth, Users, profile, channels){
  var channelsCtrl=this;
  channelsCtrl.users = Users.getAll();
  channelsCtrl.newChannel={
    name:''
  };
  channelsCtrl.profile = profile;
  channelsCtrl.channels = channels;
  channelsCtrl.getDisplayName = Users.getDisplayName;
  channelsCtrl.getGravatar = Users.getGravatar;

  channelsCtrl.createChannel = function(){
    channelsCtrl.channels.$add(channelsCtrl.newChannel).then(function(ref){
      $state.go('channels.messages', {channelId: ref.key});
    }).catch(function(e){
      console.log(e);
    })
  }
  this.logout=function(){
    Auth.$signOut().then(function(){
      $state.go('home');
    })
  }

})

angular.module('chatApp')
.factory('Channels',function($firebaseArray){

  var channels = {
    connect: function(){
      var ref=firebase.database().ref('channels');
      var channels = $firebaseArray(ref);
      return channels;
    }
  }
  return channels;

})

angular.module('chatApp')
.controller("messagesCtrl", function(profile,channelName,messages){
  var messagesCtrl = this;
  messagesCtrl.messages = messages;
  messagesCtrl.channelName = channelName;
  messagesCtrl.message = '';

  this.sendMessage=function(){
    if(messagesCtrl.message.length > 0){
      messagesCtrl.messages.$add({
        uid:profile.$id,
        body:messagesCtrl.message,
        timestamp:firebase.database.ServerValue.TIMESTAMP
      }).then(function(){
        messagesCtrl.message='';
      })
    }
  }

})

angular.module('chatApp')
.factory('Messages', function($firebaseArray){
  var chanMsgRef = firebase.database().ref('channelMessages');
  var userMsgRef = firebase.database().ref('userMessages');

  return {
    forChannel: function(chanId){
      return $firebaseArray(chanMsgRef.child(chanId));
    },
    forUsers: function(uid1, uid2){
      var path = uid1>uid2 ? uid1+'/'+uid2 : uid2+'/'+uid1;
      return $firebaseArray(userMsgRef.child(path));
    }

  }
})

angular.module('chatApp')
	.factory('originalChannels', function($firebaseArray, FirebaseUrl){

		var ref = new Firebase(FirebaseUrl + 'channels');

		var channels = $firebaseArray(ref);

		return channels;

	});

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

angular.module('chatApp')
.controller('profileCtrl', function($state, md5, auth, profile){
  var profileCtrl = this;
  profileCtrl.profile = profile;
  profileCtrl.updateProfile = function(){
    profileCtrl.profile.emailHash = md5.createHash(auth.email);
    profileCtrl.profile.gravatar = 'https://www.gravatar.com/avatar/' + profileCtrl.profile.emailHash+'?d=wavatar';
    profileCtrl.profile.$save().then(function(){
      $state.go('channels');
    });
  };
})

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
