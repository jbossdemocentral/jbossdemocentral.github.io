var app = angular.module('jbossdemocentral', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
]);
 
app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'test.html',
        controller: 'DemoCtrl'
    }).otherwise({
        redirectTo: '/'
    });
});


app.controller('DemoCtrl', function ($scope, $http) {
    $http.get('https://api.github.com/orgs/jbossdemocentral/repos').success(function (data) {
        $scope.demos = data;
    }).error(function (data, status) {
        console.log('Error ' + data);
    });
});