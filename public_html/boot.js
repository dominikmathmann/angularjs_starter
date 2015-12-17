(function () {
    "use strict";
    $(document).ready(function () {
        var initInjector = angular.injector(["ng", "globalize.services"]);
        var $window = initInjector.get("$window");
        var lang = $window.navigator.language || $window.navigator.userLanguage;
        var GlobalizeLanguageLoader = initInjector.get("GlobalizeLanguageLoader");

        GlobalizeLanguageLoader.loadLanguage(lang).then(function (globalizeInstance) {
            angular.module("AngularStarter").constant("$globalize", globalizeInstance);
            angular.bootstrap(document, ["AngularStarter"]);
        });
    });

})();


