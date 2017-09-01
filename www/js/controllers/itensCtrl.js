angular.module('itensModule', ['dbModule'])

.controller('itensCtrl', function($scope, $cordovaToast, $ionicPopup, db) {

    $scope.itens = [];

    db.selectItens()
    .then(function(data) {
        $scope.itens = data;
    }, function(err) {
        $cordovaToast.show(err, 'short', 'center');
    });

    $scope.definirImagem = function(unidadeMedida) {
        switch (unidadeMedida) {
            case 'Pacote':
                return 'img/pacote.png';
            case 'Garrafa':
                return 'img/garrafa.png';
            case 'Tubo':
                return 'img/tubo.png';
            case 'Caixa':
                return 'img/caixa.png';
            case 'Frasco':
                return 'img/frasco.png';
            case 'Lata':
                return 'img/lata.png';
            default:
                return '';
        }
    }

    $scope.excluirItem = function(idItem) {
        $ionicPopup.confirm({
            title: 'Atenção',
            cssClass: 'popup-confirm',
            template: 'Deseja excluir o item?',
            cancelText: 'Cancelar',
            cancelType: 'button-outline button-balanced',
            okText: 'OK',
            okType: 'button-outline button-balanced'
        })
        .then(function(res) {
            if (res) {
                db.deleteItem(idItem)
                .then(function(res) {
                    var arrayIds = $scope.itens.map(function(e) { 
                        return e.id; 
                    });

                    var indice = arrayIds.indexOf(idItem);
                    $scope.itens.splice(indice, 1);

                    $cordovaToast.show(res, 'short', 'center');
                }, function(err) {
                    $cordovaToast.show(err, 'short', 'center');
                });
            }
        });
    }

});