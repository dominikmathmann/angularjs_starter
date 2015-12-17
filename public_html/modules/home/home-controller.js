(function () {
    "use strict";

    angular.module("AngularStarter.home", [])

            .controller("home", function ($globalize) {
                var vm = this;
                vm.date=$globalize.formatDate(new Date());
            });
})();


