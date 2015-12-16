(function () {
    "use strict";

    angular.module("AngularStarter.home", [])

            .controller("home", function (GlobalizeLanguageLoader) {
                var vm = this;
                vm.date=GlobalizeLanguageLoader.get().formatDate(new Date());
            });
})();


