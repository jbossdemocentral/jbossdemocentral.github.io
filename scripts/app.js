var app = angular.module('jbossdemocentral', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
]);
 
app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/start.html'
    }).when('/datagrid',{
    	templateUrl: 'views/datagrid.html',
    	controller: 'JDGCtrl'
    }).when('/eap',{
    	templateUrl: 'views/eap.html',
    	controller: 'EAPCtrl'
    }).when('/bpms',{
    	templateUrl: 'views/bpms.html'
    }).when('/brms',{
    	templateUrl: 'views/brms.html'
    }).when('/fuse',{
    	templateUrl: 'views/fuse.html'
    }).when('/fsw',{
    	templateUrl: 'views/fsw.html'
    }).when('/dv',{
    	templateUrl: 'views/dv.html'
    }).otherwise({
        redirectTo: '/'
    });
});

app.controller('TabsCtrl', ['$scope', function ($scope) {
    $scope.tabs = [{title: 'Start',url: '#'}, {title: 'JBoss EAP Demos',url: '#eap'}, {title: 'DataGrid Demos',url: '#datagrid'}, {title: 'BPM Suite Demos',url: '#bpms'}, {title: 'BRMS Demos',url: '#brms'},{title: 'Fuse Demos',url: '#fuse'},{title: 'FSW Demos',url: '#fsw'},{title: 'DV Demos',url: '#dv'}];

    $scope.currentTab = '#';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }
}]);


app.controller('JDGCtrl', function ($scope, $http) {
    $scope.demos = new Array();
	$http.get('https://api.github.com/orgs/jbossdemocentral/repos').success(function (repos) {
    	//filter on name
    	var demos = repos.filter(function(repo) {
    		 return repo.name.match("DATAGRID");
    	});
    	$scope.demos=demos;
    	demos.forEach(function(demo) { getDemoConfig(demo,$http,$scope) });
    	
    }).error(function (data, status) {
        console.log('Error ' + data);
    });  
});

app.controller('EAPCtrl', function ($scope, $http) {
    $scope.demos = new Array();
	$http.get('https://api.github.com/orgs/jbossdemocentral/repos').success(function (repos) {
    	//filter on name
    	var demos = repos.filter(function(repo) {
    		 return repo.name.match("EAP");
    	});
    	$scope.demos=demos;
    	demos.forEach(function(demo) { getDemoConfig(demo,$http,$scope) });
    	
    }).error(function (data, status) {
        console.log('Error ' + data);
    });  
});

var getDemoConfig = function(demo, $http, $scope) {
	$http.get(demo.url + "/contents/demo-config.json").success(function(data) {
		var encodedData="";
		data.content.split('\n').forEach(function(part) {
			encodedData+=part;
		});
		var config = JSON.parse(atob(encodedData));
		demo.level = config.level;
		demo.description = config.summary;
		demo.author = config.author;
		demo.prerequisites = config.prerequisites;
		demo.targetProduct = config.targetProduct;
		demo.productVersion = config.productVersion;
		demo.technologies =  config.technologies;
		demo.links = config.links;
		$scope.demos.push(demo);
	});
}
    
app.filter('matchString', function () {
  return function (items, searchStr) {
	  return items.filter(function (item) {
		  return item.name.match(searchStr);
	  });
  }
});

app.filter('matchStringOrString', function () {
  return function (items, searchStr1, searchStr2) {
	  return items.filter(function (item) {
		  return item.name.match(searchStr1) || item.name.match(searchStr2);
	  });
  }
});

app.filter('matchStringAndString', function () {
  return function (items, searchStr1, searchStr2) {
	  return items.filter(function (item) {
		  return item.name.match(searchStr1) && item.name.match(searchStr2);
	  });
  }
});

app.filter('hasDemoConfig', function () {
  return function (items) {
	  return items.filter(function (item) {
		  var hasConfig=false;
		  $http.get(item.url + "/contents").success(function(response) {
			  alert(response.status);
			  response.filter(function(file) {
				  alert(file.name);
				  if(file.name=="demo-config.json")
					hasConfig=true;
			}).error(function (data, status) {
		        console.log('Error ' + data);
		    }); 
		  });
		  //return item.name.match(searchStr1) && item.name.match(searchStr2);
		  return hasConfig;
	  });
  }
});

