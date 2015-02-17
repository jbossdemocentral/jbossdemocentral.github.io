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
    	templateUrl: 'views/fuse.html',
    	controller: 'FUSECtrl'
    }).when('/dv',{
    	templateUrl: 'views/dv.html'
    }).when('/integrated',{
    	templateUrl: 'views/integrated.html',
	controller: 'INTEGRATIONCtrl'
    }).otherwise({
        redirectTo: '/'
    });
});

app.controller('TabsCtrl', ['$scope', function ($scope) {
    $scope.tabs = [{title: 'Start',url: '#'},{title: 'Integration Demos',url: '#integrated'}, {title: 'JBoss EAP Demos',url: '#eap'}, {title: 'DataGrid Demos',url: '#datagrid'}, {title: 'BPM Suite Demos',url: '#bpms'}, {title: 'BRMS Demos',url: '#brms'},{title: 'Fuse Demos',url: '#fuse'},{title: 'DV Demos',url: '#dv'}];

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
	$http.get('https://api.github.com/orgs/jbossdemocentral/repos?per_page=200').success(function (repos) {
    	//filter on name
    	var demos = repos.filter(function(repo, status, headers, config) {
    		 return repo.name.toUpperCase().match("DATAGRID");
    	});
    	demos.forEach(function(demo) { getDemoConfig(demo,$http,$scope) });
    	
    }).error(function (data, status) {
        console.log('Error ' + data);
    });  
});


app.controller('INTEGRATIONCtrl', function ($scope, $http) {
    $scope.demos = new Array();
	$http.get('https://api.github.com/orgs/jbossdemocentral/repos?per_page=200').success(function (repos) {
    	//filter on name
    	var demos = repos.filter(function(repo, status, headers, config) {
    		 return repo.name.toUpperCase().match("INTEGRATION");
    	});
    	demos.forEach(function(demo) { getDemoConfig(demo,$http,$scope) });
    	
    }).error(function (data, status) {
        console.log('Error ' + data);
    });  
});

app.controller('FUSECtrl', function ($scope, $http) {
    $scope.demos = new Array();
	$http.get('https://api.github.com/orgs/jbossdemocentral/repos?per_page=200').success(function (repos) {
    	//filter on name
    	var demos = repos.filter(function(repo) {
    		 return repo.name.toUpperCase().match("FUSE");
    	});
    	demos.forEach(function(demo) { getDemoConfig(demo,$http,$scope) });
    	
    }).error(function (data, status) {
        console.log('Error ' + data);
    });  
});

app.controller('EAPCtrl', function ($scope, $http) {
    $scope.demos = new Array();
	$http.get('https://api.github.com/orgs/jbossdemocentral/repos?per_page=200').success(function (repos) {
    	//filter on name
    	var demos = repos.filter(function(repo) {
    		 return repo.name.toUpperCase().match("EAP");
    	});
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
		if(config!=null && config.published) {
			if(config.name!=null) 
				demo.name=config.name;
			if(config.img_src!=null) {
				demo.has_image=true;
				demo.img_src=config.img_src;
			}
			
			demo.level = config.level;
			demo.description = config.summary;
			demo.author = config.author;
			demo.prerequisites = config.prerequisites;
			demo.targetProduct = config.targetProduct;
			demo.productVersion = config.productVersion;
			demo.technologies =  config.technologies;
			demo.links = config.links;
			$scope.demos.push(demo);
		}
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
