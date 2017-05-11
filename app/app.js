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
