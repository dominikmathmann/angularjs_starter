(function () {
    "use strict";

    angular.module("globalize.services", [])

            .factory("GlobalizeLanguageLoader", function ($http, $q) {
                var cldrPath = 'resources/i18n/cldr-data';

                var commonData = [
                    // für numerische Formate
                    '/supplemental/likelySubtags.json',
                    '/supplemental/numberingSystems.json',
                    // für Datum
                    '/supplemental/timeData.json',
                    '/supplemental/weekData.json'
                ];

                var languageData = [
                    // für numerische Formate
                    '/numbers.json',
                    // für Datum
                    '/ca-gregorian.json',
                    '/timeZoneNames.json'
                ];

                var buildReferences = function (language) {
                    return commonData
                            .map(function (element) {
                                return cldrPath + element;
                            })
                            .concat(
                                    languageData.map(function (element) {
                                        return cldrPath + "/main/" + language + element;
                                    }));



                };

                return {
                    loadLanguage: function (language)
                    {
                        var def = $q.defer();
                        var cldrData = buildReferences(language);
                        var cldrDataPromises = cldrData.map(function (url) {
                            return $http.get(url);
                        });

                        $q.all(cldrDataPromises).then(function (response) {
                            response.forEach(function (element) {
                                Globalize.load(element.data);
                            });
                            def.resolve(new Globalize(language));
                        }, function () {
                            def.reject();
                        });

                        return def.promise;
                    }
                };
            });
})();


