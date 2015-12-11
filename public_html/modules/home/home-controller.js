(function () {
    "use strict";

    angular.module("AngularStarter.home", [])

            .controller("home", function () {
                var vm = this;
                vm.hello = "Hello From AngularJS - Home";
            });
})();


