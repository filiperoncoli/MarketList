angular.module('listaModule', ['dbModule'])

.controller('listaCtrl', function($scope, $rootScope, db, $ionicPopup, $cordovaToast, $ionicActionSheet) {

    $scope.confirmarCompra = function(check, item) {
        if (check) {
            $scope.preco = {};

            $ionicPopup.show({
                template: '<label class="item item-input" name="preco"><input type="number" step=0.01 ng-model="preco.valor"></label>',
                title: 'Preço do Item',
                cssClass: 'popup-confirm',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-outline button-balanced',
                        onTap: function(e) {
                            check = false;
                        }
                    },
                    {
                        text: 'OK',
                        type: 'button-outline button-balanced',
                        onTap: function(e) {
                            item.preco_unitario = $scope.preco.valor;
                            item.in_checado = 'S';

                            if (item.preco_unitario <= 0 || !angular.isDefined(item.preco_unitario)) {
                                e.preventDefault();
                            }
                        }
                    }
                ]
            });
        } else {
            item.preco_unitario = null;
            item.in_checado = 'N';
        }
    }

    $scope.excluirItem = function(idItem, idLista) {
        $ionicPopup.confirm({
            title: 'Atenção',
            cssClass: 'popup-confirm',
            template: 'Deseja excluir o item da sua lista?',
            cancelText: 'Cancelar',
            cancelType: 'button-outline button-balanced',
            okText: 'OK',
            okType: 'button-outline button-balanced'
        })
        .then(function(res) {
            if (res) {
                db.deleteListaItem(idItem, idLista)
                .then(function(res) {
                    var arrayIds = $rootScope.listaAtual.map(function(e) { 
                        return e.id; 
                    });

                    var indice = arrayIds.indexOf(idItem);
                    $rootScope.listaAtual.splice(indice, 1);
                    
                    $cordovaToast.show(res, 'short', 'center');
                }, function(err) {
                    $cordovaToast.show(err, 'short', 'center');
                });
            }
        });
    }

    $scope.mostrarOpcoes = function() {
        $ionicActionSheet.show({
            buttons: [
                {text: '<i class="icon ion-android-done balanced"></i>Finalizar Compra'},
                {text: '<i class="icon ion-social-usd positive"></i>Conta Atual'},
                {text: '<i class="icon ion-android-close assertive"></i>Excluir Lista'}
            ],
            buttonClicked: function(index) {
                console.log(index);
                switch (index) {
                    case 0:

                        break;
                    case 1:
                        
                        break;

                    case 2:

                        break;

                    default:
                        break;
                }
                return true;
            }
        });
    }

});