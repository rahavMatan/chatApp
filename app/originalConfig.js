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
