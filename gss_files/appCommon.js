function appCommon($scope) {

    $scope.validateIP = function (ip) {
        var reg = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        if(reg.test(ip)) {
            console.log(RegExp.$4);
            var ip1 = Number(RegExp.$1);
            var ip2 = Number(RegExp.$2);
            var ip3 = Number(RegExp.$3);
            var ip4 = Number(RegExp.$4);
            if (ip1 < 256 && ip2 < 256 && ip3 < 256 && ip4 < 256) {
                return true;
            }
        }
        return false;
    };

    $scope.validateName = function (text) {
        //var reg = /[a-zA-Z]{1,}[0-9]{1,}/;
	var reg = /[a-zA-Z]*[0-9]*/;
	if(reg.test(text)){
	  return true;
	}
	return false;
    };

    $scope.validateMac = function (mac) {
	var reg = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
        if(reg.test(mac)) {
	  return true;
        }
        return false;
    };

    $scope.showFilesContent = function (contentType,id) {
        if(contentType=='script') {
            $scope.displayType = 'script';
            $scope.scroll2Id('#'+id);
        }

        if(contentType=='file') {
            $scope.displayType = 'file';
            $scope.scroll2Id('#'+id);
        }
    };

    $scope.scroll2Id = function(id) {
        setTimeout(function(){
            $('html,body').animate({scrollTop: $(id).offset().top},'fast');
        }, 100);
    };

    $scope.generateFile = function(content) {
        var blob = new Blob([content], {type :'text/cmd'});
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        return url;
    };

}