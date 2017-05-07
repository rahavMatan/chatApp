angular.module('chatApp',['ui.router','firebase','angular-md5'])
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'home/home.html'
  })
  .state('login', {
    url: '/login',
    controller: 'authCtrl as authCtrl',
    templateUrl: 'auth/login.html',
    resolve: {
      requireNoAuth: function($state, Auth){
        return Auth.$requireSignIn().then(function(auth){
          $state.go('home');
        }, function(error){
          return;
        });
      }
   }
  })
  .state('register', {
    url: '/register',
    controller: 'authCtrl as authCtrl',
    templateUrl: 'auth/register.html',
    resolve: {
      requireNoAuth: function($state, Auth){
        return Auth.$requireSignIn().then(function(auth){
          $state.go('home');
        }, function(error){
          return;
        });
      }
   }
  })
  .state('profile', {
    url: '/profile',
    resolve: {
      auth: function($state, Users, Auth){
        return Auth.$requireSignIn().catch(function(){
          $state.go('home');
        });
      },
      profile: function(Users, Auth){
        return Auth.$requireSignIn().then(function(auth){
          return Users.getProfile(auth.uid).$loaded();
        });
      }
    }
  })

  $urlRouterProvider.otherwise('/');

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
