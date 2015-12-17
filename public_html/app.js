(function () {
    "use strict";
    angular.module("AngularStarter", ['AngularStarter.home', 'ui.router', 'globalize.services', 'pascalprecht.translate'])

            .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
                $stateProvider
                        .state('home', {
                            url: '/home',
                            templateUrl: 'modules/home/home.html',
                            controller: 'home',
                            controllerAs: 'vm'
                        });

                $urlRouterProvider.otherwise("home");

                $translateProvider.useSanitizeValueStrategy('escape');
                $translateProvider.registerAvailableLanguageKeys(['de', 'en'], {
                    'en_*': 'en',
                    'de_*': 'de'
                });

                $translateProvider.determinePreferredLanguage();
                $translateProvider.fallbackLanguage('de');

                $translateProvider.useStaticFilesLoader({
                    prefix: 'resources/i18n/',
                    suffix: '.json'
                });
            });
})();


