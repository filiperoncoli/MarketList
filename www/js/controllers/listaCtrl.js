angular.module('listaModule', ['dbModule'])

.controller('listaCtrl', function($scope, $rootScope, db, $ionicPopup, $cordovaToast) {

    $scope.confirmarCompra = function(item) {
        if (item.check) {
            $scope.form = {
                quantidade: item.quantidade,
                descricaoItem: item.descricao
            };

            $ionicPopup.show({
                template: '<label class="item item-input">' +
                            '<span class="input-label popup-label">Preço:</span>' +
                            '<input type="number" step=0.01 ng-model="form.preco">' + 
                          '</label>' +
                          '<label class="item item-input">' +
                            '<span class="input-label popup-label">Quantidade:</span>' +
                            '<input type="number" ng-model="form.quantidade">' + 
                          '</label>',
                title: item.descricao,
                cssClass: 'popup-confirm',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-outline button-balanced',
                        onTap: function(e) {
                            item.check = false;
                        }
                    },
                    {
                        text: 'OK',
                        type: 'button-outline button-balanced',
                        onTap: function(e) {
                            item.preco_unitario = $scope.form.preco;
                            item.quantidade = $scope.form.quantidade;
                            item.in_checado = 'S';

                            $rootScope.totalConta = !angular.isDefined($rootScope.totalConta) ? 0 : $rootScope.totalConta;
                            $rootScope.totalConta += (item.preco_unitario * item.quantidade);

                            if (item.preco_unitario <= 0 || !angular.isDefined(item.preco_unitario) || item.quantidade <= 0 || !angular.isDefined(item.quantidade)) {
                                e.preventDefault();
                            } else {
                                db.updateListaItem(item)
                                .then(function(res) {

                                }, function(err) {
                                    $cordovaToast.show(err, 'short', 'center');
                                });
                            }
                        }
                    }
                ]
            });
        } else {
            $rootScope.totalConta -= (item.preco_unitario * item.quantidade);
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

    $scope.finalizarLista = function() {
        $ionicPopup.confirm({
            title: 'Atenção',
            cssClass: 'popup-confirm',
            template: 'Deseja finalizar sua lista?',
            cancelText: 'Cancelar',
            cancelType: 'button-outline button-balanced',
            okText: 'OK',
            okType: 'button-outline button-balanced'
        })
        .then(function(res) {
            if (res) {
                var dataAtual = new Date();
                var dataFormatada = dataAtual.getDate() + '/' + (dataAtual.getMonth() + 1) + '/' + dataAtual.getFullYear();

                db.updateListaItem($rootScope.listaAtual)
                .then(function(res) {
                    db.updateLista({id: $rootScope.listaAtual[0].id_lista, in_finalizada: 'S', dt_compra: dataFormatada})
                    .then(function(res) {
                        $cordovaToast.show('Lista finalizada com sucesso', 'short', 'center');
                        $rootScope.listaAtual = [];
                    }, function(err) {
                        $cordovaToast.show(err, 'short', 'center');
                    });
                }, function(err) {
                    $cordovaToast.show(err, 'short', 'center');
                });
            }
        });
    }

    $scope.excluirLista = function() {
        $ionicPopup.confirm({
            title: 'Atenção',
            cssClass: 'popup-confirm',
            template: 'Deseja excluir a lista?',
            cancelText: 'Cancelar',
            cancelType: 'button-outline button-balanced',
            okText: 'OK',
            okType: 'button-outline button-balanced'
        })
        .then(function(res) {
            if (res) {
                db.deleteLista($rootScope.listaAtual[0].id_lista)
                .then(function(res) {
                    $cordovaToast.show(res, 'short', 'center');
                    $rootScope.listaAtual = [];
                }, function(err) {
                    $cordovaToast.show(err, 'short', 'center');
                });
            }
        });
    }

});