(function () {
    "use strict";
    angular.module("AngularStarter", ['AngularStarter.home', 'ui.router'])

            .config(function ($stateProvider, $urlRouterProvider) {
                $stateProvider.state('home',{
                    url: '/home',
                    templateUrl: 'modules/home/home.html',
                    controller: 'home',
                    controllerAs: 'vm'
                });
                
                 $urlRouterProvider.otherwise("/home");
            });
})();


