(function () {
    'use strict';

    angular
        .module('OTRWebApp')

        .filter('intToCurrency', function ($filter) {
            return function (input) {

                if (isInt(input)) {

                    var isNegative = false;
                    if (input < 0) {
                        isNegative = true;
                        input = input * -1;
                    }

                    var cents = input % 100,
                        dollars = (input - cents) / 100;

                    if (isNegative) {
                        dollars = dollars * -1;
                    }

                    return $filter('currency')(dollars + '.' + cents);
                } else {
                    return input;
                }
            }
        })

        .filter('centsToDollars', function ($filter) {
            return function (input) {

                if (isInt(input)) {

                    var isNegative = false;
                    if (input < 0) {
                        isNegative = true;
                        input = input * -1;
                    }

                    var cents = input % 100,
                        dollars = (input - cents) / 100;

                    if (isNegative) {
                        dollars = dollars * -1;
                    }

                    return (dollars + '.' + cents);
                } else {
                    return input;
                }
            }
        })

        .filter('currencyToInt', function ($filter) {
            return function (input) {
                if (input) {
                    return input * 100;
                }
            }
        })

        .filter('yesNo', function () {
            return function (input) {
                if (input === true) {
                    return 'Yes';
                } else if (input === false) {
                    return 'No';
                } else {
                    return ' - ';
                }
            }
        })
})();