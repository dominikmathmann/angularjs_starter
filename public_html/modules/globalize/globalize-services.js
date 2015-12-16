(function () {
    "use strict";

    angular.module("globalize.services", [])

            .factory("GlobalizeLanguageLoader", function ($http, $q) {
                var cldrPath='resources/i18n/cldr-data';
                
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

                var globalizeInstance;

                return {
                    loadLanguage: function (language)
                    {
                        var def = $q.defer();

                        if (!globalizeInstance || globalizeInstance.cldr.locale !== language)
                        {

                            var cldrData = buildReferences(language);
                            var cldrDataPromises = cldrData.map(function (url) {
                                return $http.get(url);
                            });

                            $q.all(cldrDataPromises).then(function (response) {
                                response.forEach(function (element) {
                                    Globalize.load(element.data);
                                });
                                globalizeInstance = new Globalize(language);
                                def.resolve();
                            }, function () {
                                def.reject();
                            });
                        }
                        else
                        {
                            def.resolve();
                        }

                        return def.promise;
                    },
                    get: function () {
                        return globalizeInstance;
                    }
                };
            });
})();


