function vars($scope){
  $scope.desc = "This tool is designed to help you understand compatibility among products of the Red Hat Cloud Infrastructure (RHCI) family. It also shows all compatible product combinations including one or more specified products.";
  $scope.contentTitle = "Product Versions";
  $scope.processingIndex="0";
  $scope.fullProcessingIndex="0";
  $scope.errorInfoInit="1";
  $scope.conMode=false;
  $scope.NOTUSED = "Not Used";
  $scope.NOTSPECIFIED = "Not Specified";
  $scope.errorInfoText = "At least two products must be selected.";
  $scope.comProdTitle = "Compatible Combinations";
  $scope.modeChosenInit = "1";
  $scope.checkmode = "Check compatibility";
  $scope.findmode = "Show compatible combinations";
  $scope.error = "error";
  $scope.errorindex = "0";
}
