angular.module('historicoModule', ['dbModule'])

.controller('historicoCtrl', function($scope, db, $cordovaToast) {

    db.selectListasFinalizadas()
    .then(function(res) {
        console.log(res);
        $scope.listas = res;
    }, function(err) {
        $cordovaToast.show(err, 'short', 'center');
    });

});