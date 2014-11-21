function mainctrl($scope, $http){
  
  $http({
    url : window.location.pathname+"/application/init",
    method : "post"       
  }).success(function(data, status, headers, config) {
    $scope.products = data[0];
    for(var i=0;i<data[0].length;i++){
      var temp = data[0][i].vername.split(",");
      var arrayTemp = new Array();
      for(var m=0;m<temp.length;m++){
	var t = new Array();
	t[0] = temp[m];
	t[1] = temp[m];
	arrayTemp[m]=t;
      }
      data[0][i].vername = arrayTemp;
    } 
  }).error(function(data, status, headers, config) {
    showerror();
  }); 
  
  var getSelCombinations = function(selArray){
    var combArray = new Array();
    var combArrayIndex = 0;
    for(var i=0; i<selArray.length-1;i++){
      versionSelOuter = selArray[i][1];
      for(var j=i+1;j<selArray.length;j++){
	versionSelInner = selArray[j][1];
	var paramTemp = new Array();
	paramTemp[0] = selArray[i][0];
	paramTemp[1] = versionSelOuter;  
	paramTemp[2] = selArray[j][0];
	paramTemp[3] = versionSelInner; 
	paramTemp[4] = selArray[i][2];
	paramTemp[5] = selArray[j][2];
	combArray[combArrayIndex] = paramTemp;
	combArrayIndex++;	
      }      
    }//end for 
    return combArray;
  }
  
  var getSel = function(prodcode){    
    var selArray = new Array();
    var selArrayIndex = 0;
    for(var i=0; i<$scope.products.length;i++){
      if($scope.products[i].verSelected == $scope.NOTUSED || $scope.products[i].verSelected == $scope.NOTSPECIFIED || $scope.products[i].prodcode == prodcode)
	continue;
      var paramTemp = new Array();
      paramTemp[0] = $scope.products[i].prodcode;
      paramTemp[1] = $scope.products[i].verSelected; 
      paramTemp[2] = $scope.products[i].prodname;

      
      var verArray = $scope.products[i].vername;
      for(var k=0;k<verArray.length;k++){
	if($scope.products[i].verSelected == verArray[k][0]){	 
	  paramTemp[3] = verArray[k][1];
	}	
      }	
      selArray[selArrayIndex] = paramTemp;
      selArrayIndex++;	    
    }//end for
    return selArray;
  }
  
  $scope.verify = function(){ 
    $scope.errorInfoInit="0";
    paramArray = getSelCombinations(getSel());
    //inputCheck();
    if(paramArray.length > 0){ 
      $scope.processingIndex="1"; 
      prodComp(paramArray);
    }else {
      $scope.errorInfo="1";
    }
    
    //analytics trigger
    window.chrometwo_require(["analytics/main"], function (analytics) {
      analytics.trigger("LabsCompletion");         
    });
  }
  
  $scope.find = function(){
    $scope.errorInfoInit="0";
    //inputCheck("getParam"); 
    paramArray = getSelCombinations(getSel());
    if(paramArray.length > 0){ 
      $scope.processingIndex="1"; 
      prodComp(paramArray,"getParamInComprodMode");
    }else {
      $scope.selComp="Compatible";
      $scope.getComList();
    }
    
    //analytics trigger
    window.chrometwo_require(["analytics/main"], function (analytics) {
      analytics.trigger("LabsCompletion");         
    });
  }
  
  var prodComp = function(params,paraStr,index){
      var param = {
	params: params      
      }
      $http({
	url : window.location.pathname+"/application/prodCompatibility",
	method : "post",
	data : param      
      }).success(function(data, status, headers, config) {
	$scope.processingIndex="0";
	if(paraStr=="getParamInComprodMode"){
	  $scope.selComp=data[0][0];
	  $scope.getComList();//get compatible combinations
	}else if(paraStr=="preCheckForDropDown"){
	  $scope.preCheckComp=data[0][0];
	  if( index!="" && index!=undefined){
	    $scope.getDynamicList(index);//getDynamicList
	  }else{
	    $scope.getDynamicList();//getDynamicList	
	  }	  
	}else {
	  $scope.prodcomp = data;
	  $scope.result = data[0][0];
	  $scope.resultTitle = data[0][0];
	  $scope.urls = data[0][1];
	  $scope.icon = data[0][2];
	  $scope.resultshow = '1'
	  $scope.scroll2Id('#resultsId');
	  
	  //getDynamicList
	  $scope.preCheckComp=data[0][0];
	  $scope.getDynamicList();
	}
      }).error(function(data, status, headers, config) {
	$scope.processingIndex="0"; 
	showerror();
      });     
  }
  
  $scope.fullFeature = function(){ 
    $scope.fullProcessingIndex="1"; 
    $scope.fullFeatureBtn = "0"
    if ($scope.result!="Compatible"){ /* The data have been got while verifying */
      $scope.capacities = $scope.prodcomp[1];
      $scope.fullFeatureshow = "1";
      $scope.fullProcessingIndex="0";  
    }else{
      var param = {
	params: paramArray      
      }
      $http({
	url : window.location.pathname+"/application/capaCompatibility",
	method : "post",
	data : param      
      }).success(function(data, status, headers, config) {
	$scope.capacities = data;
	$scope.fullFeatureshow = "1";
	$scope.fullProcessingIndex="0";  
      }).error(function(data, status, headers, config) {
	$scope.fullProcessingIndex="0"; 
	showerror();
      });  
    }
  }
  
  $scope.inputChanged =  function(index){
    allHide();
    var sel = getSel();
    if($scope.conMode==false){
      if(sel.length > 1){ 
	$scope.errorInfo="0";	
      }else{  
	$scope.errorInfo="1";	
      }      
    }else{
      if(sel.length > 0){ 
	$scope.errorInfo="0";	
      }else{  
	$scope.errorInfo="1";	
      }
      
    }
    
    //getDynamicList  
    //$scope.getThisList(prodcode,selver);
    refreshSeled(index);
  } 
   
  $scope.rerun = function(obj){
    clearDropdown();
    var combination = obj.prod.prod;
    combination = combination.replace(" and "," ");
    var comArray = combination.split(" ");    
    for(var i=0; i<$scope.products.length;i++){
      if($scope.products[i].prodname == comArray[0]){
	$scope.products[i].verSelected = comArray[1];
      }
      if($scope.products[i].prodname == comArray[2]){
	$scope.products[i].verSelected = comArray[3];
      }
    }
    allHide();
    $scope.verify();    
  } 
   
  $scope.export2CSV = function(data,title,head){
    debugger;
    var csvContent = head+"\n";
    for(var i=0;i<data.length;i++){
      csvContent += data[i].capaname;
      csvContent += ","+data[i].capastate+"\n";
    }
    var blob = new Blob([csvContent], {type: "text/csv"});
    saveAs(blob, title+".csv");
  }
   
  $scope.exportCP2CSV = function(data,title,head){
    debugger;
    var csvContent = head+"\n";
    for(var i=0;i<data.length;i++){
      csvContent += '"'+$scope.paramSelStr+', '+data[i][0]+'"';
      csvContent += ","+data[i][1]+"\n";
    }
    var blob = new Blob([csvContent], {type: "text/csv"});
    saveAs(blob, title+".csv");
  }
    
  $scope.clear = function(){    
    for(var i=0; i<$scope.products.length;i++){
    	if($scope.conMode==true){
    	    $scope.products[i].verSelected = $scope.NOTSPECIFIED;
    	}else{
    	    $scope.products[i].verSelected = $scope.NOTUSED;
    	}    	    
    }   
    allHide();
    $scope.selprod = null; 
    $scope.getDynamicList();
  }
  
  var allHide = function(){
    $scope.resultshow = '0' 
    $scope.fullFeatureshow = "0"; 
    $scope.fullFeatureBtn = "1";
    $scope.comProducts = "0";
  }
  
  $scope.modeSwitch = function(conMode){
    allHide();  
    $scope.clear();
    $scope.conMode = conMode;
    $scope.errorInfoInit="1";
    for(var i=0; i<$scope.products.length;i++){
    	if($scope.conMode==true){
    	    $scope.products[i].verSelected = $scope.NOTSPECIFIED;
    	    $scope.errorInfoText = "At least one product must be selected.";
	    $scope.findColor="#0085cf";
	    $scope.verifyColor="";
    	}else{
    	    $scope.products[i].verSelected = $scope.NOTUSED;
    	    $scope.errorInfoText = "At least two products must be selected.";
	    $scope.findColor="";
	    $scope.verifyColor="#0085cf";
    	}    	    
    } 
    $scope.modeChosenInit = "0";
  }
  
  $scope.getComList =  function(){
      paramArray = getSel();
      detailParamArray = new Array();
      var paramArrayIndex = 0;
      $scope.paramSelStr = "";
      for(var i=0; i<paramArray.length;i++){
	  $scope.paramSelStr += paramArray[i][2] + " " + paramArray[i][1] + ", "
      }
      $scope.paramSelStr = $scope.paramSelStr.substring(0,$scope.paramSelStr.length-2);
      if($scope.selComp=="Compatible" || $scope.selComp=="Compatible (Tech Preview)"){
	$scope.com = "0";
	$scope.fullFeatureshow = "0"; 
	$scope.errorInfoInit="0"; 
	if(paramArray.length >0){
	  $scope.processingIndex="1"; 
	  getCompatibleComb();	  
	}else {
	  $scope.comProducts = "0";
	  $scope.errorInfo="1";
	  $scope.selprod = null;
	  $scope.scroll2Id('#comproductsId'); 		  
	}	
      }else{
	$scope.comProducts = "1";
	$scope.selprod = null;	
	$scope.scroll2Id('#comproductsId'); 	
      }
  }
  
  var getCompatibleComb = function(){
    var param = {
      params: paramArray,
      selC: $scope.selComp      
    }
    $http({
      url : window.location.pathname+"/application/getComList",
      method : "post",
      data : param        
    }).success(function(data, status, headers, config) {	
      if(data ==null){
	$scope.selprod = null;		
      }else{
	$scope.selprod = data;		
      }
      $scope.comProducts = "1";
      $scope.scroll2Id('#comproductsId'); 
      $scope.processingIndex="0"; 
      $scope.errorInfo="0";	      
    }).error(function(data, status, headers, config) {
	showerror();
    });	    
  }
  
  $scope.showDetails = function(prodver,id){ 
    $scope.loadingId = id;
    $scope.fullProcessingIndex="1"; 
    var temp = prodver.split(",");
    paramArray[paramArray.length] = temp;
    var paramDetails = new Array();
    paramDetailsIndex=0;
    for(var i=0;i<paramArray.length-1;i++){
      for(var j=i+1;j<paramArray.length;j++){
	var paramTemp = new Array();
	paramTemp[0] = paramArray[i][0];
	paramTemp[1] = paramArray[i][1];  
	paramTemp[2] = paramArray[j][0];
	paramTemp[3] = paramArray[j][1];  
	paramTemp[4] = paramArray[i][2];
	paramTemp[5] = paramArray[j][2];
	paramDetails[paramDetailsIndex] = paramTemp;
	paramDetailsIndex++;	
      }
    }
    var param = {
      params: paramDetails       
    }
    $http({
      url : window.location.pathname+"/application/capaCompatibility",
      method : "post",
      data : param            
    }).success(function(data, status, headers, config) {
      paramArray.pop();
      $scope.capacities = data;
      $scope.fullFeatureshow = "1";
      $scope.fullProcessingIndex="0";
      $scope.scroll2Id('#fullFeatureId');
    }).error(function(data, status, headers, config) {
      $scope.fullProcessingIndex="0"; 
      showerror();
    });    
  }
  
  var clearDropdown = function(prodcode){ 
    for(var i=0; i<$scope.products.length;i++){
      var verArray = $scope.products[i].vername;
      if(prodcode != "" && prodcode != undefined){
      	if($scope.products[i].prodcode != prodcode)
      	  continue;
      }
      for(var k=0;k<verArray.length;k++){
	  verArray[k][1] = verArray[k][0];	
      }	      
    }//end for
  }
  
  $scope.getDynamicList = function(index){
    /*
    var prodcode = "";
    var paramArrayTemp;
    if(index != "" && index != undefined){
      prodcode = $scope.products[index].prodcode;
      paramArrayTemp = getSel(prodcode);
    }else{
      paramArrayTemp = getSel();
    }
    comStr = $scope.preCheckComp;
    if(paramArrayTemp.length >0){	
      var param = {
	params: paramArrayTemp,
	comStr:	comStr,
	prodcode:prodcode
      }
      $http({
	url : window.location.pathname+"/application/getDynamicList",
	method : "post",
	data : param 	
      }).success(function(data, status, headers, config) {
	console.info(data);
	if(data.length>0){
	  for(var j=0;j<data.length;j++){
	    if(data[j].prod==$scope.products[index].prodcode){
	      var verArray = $scope.products[index].vername;
	      var v = data[j].v;
	      var s = data[j].s;
	      for(var k=0;k<verArray.length;k++){
		if(v==verArray[k][0]){
		  verArray[k][1] = v+" ("+s+")";  		  
		}		
	      }	      
	    }	    
	  }// end outer for
	}else{
	  var verArray = $scope.products[index].vername;
	  for(var k=0;k<verArray.length;k++){
	    verArray[k][1] = verArray[k][0] +" (Unknown)";  
	  }	  
	}
      }).error(function(data, status, headers, config) {
	showerror();
      });       
    }else {
      clearDropdown();
    }
    //*/
  }
  
  $scope.getThisList = function(index){
    //clearDropdown();
    var prodcode = $scope.products[index].prodcode;
    var paramArrayTemp = getSelCombinations(getSel(prodcode));
    if(paramArrayTemp.length > 0){ 
      prodComp(paramArrayTemp,"preCheckForDropDown",index);	      
    }else {
      $scope.preCheckComp="Compatible";
      $scope.getDynamicList(index);      
    }
  }
  
  var refreshSeled = function(index){
    /*
    var c = "";
    var verArray = $scope.products[index].vername;
    var sel = $scope.products[index].verSelected;
    if(sel != $scope.NOTUSED && sel != $scope.NOTSPECIFIED){
      for(var k=0;k<verArray.length;k++){
	if(sel==verArray[k][0]){
	  c = verArray[k][1];
	  break;
	}	
      }	      
    }
    var selr = "";
    var s = "";
    if(c!=""){
      if(c.indexOf("(")!=-1)
	selr = c.substring(c.indexOf("("),c.length);
      else 
	if(getSel().length>1)
	  selr = "Unknown";
      s = compJudgement(selr);
    }else{
      var param = getSelCombinations(getSel());
      //inputCheck();
      if(param.length > 0){ 
	prodComp(param,"preCheckForDropDown");
	s = $scope.preCheckComp;
      }else {
	s = "";	
      }
    }
    for(var j=0; j<$scope.products.length;j++){
      if($scope.products[j].verSelected == $scope.NOTUSED || $scope.products[j].verSelected == $scope.NOTSPECIFIED)
	continue;
      var verArray = $scope.products[j].vername;
      var sel = $scope.products[j].verSelected;
      for(var k=0;k<verArray.length;k++){
	if(sel==verArray[k][0] && s!=""){
	  verArray[k][1] = verArray[k][0]+" ("+s+")"; 	  
	}else if(s=="")	{
	  verArray[k][1] = verArray[k][0]; 	  
	}
      }	      
    }//end
    //*/
  }
  
  var compJudgement = function(resultStr){
    var result = "";
    if(resultStr!=""){
      var result = "Compatible";
      if( resultStr.indexOf("Tech Preview") != -1 || resultStr.indexOf("Compatible (Tech Preview)") != -1 ){
	result = "Compatible (Tech Preview)";	
      }
      if( resultStr.indexOf("Unknown") != -1){
	result = "Unknown";	
      }
      if( resultStr.indexOf("Incompatible") != -1 || resultStr.indexOf("No") != -1){
	result = "Incompatible";	
      }
    }
    return result;
  }
  
  var showerror = function(){
    allHide();
    $scope.errorindex = "1";
    $scope.scroll2Id('#errorPanel');
  }
  
}