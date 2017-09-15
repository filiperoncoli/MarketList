angular.module('adicionarItensModule', ['dbModule'])

.controller('adicionarItensCtrl', function($scope, $rootScope, $stateParams, $state, $cordovaToast, db) {

    $scope.itens = [];
    $scope.contItens = 0;
    var idLista;
    var itensSelecionados = [];

    if ($stateParams.novaLista) {
        $scope.titulo = 'Nova Lista';
        idLista = undefined;
    } else {
        $scope.titulo = 'Adicionar Itens';
        idLista = $rootScope.listaAtual[0].id_lista;
    }

    db.selectItens(idLista)
    .then(function(data) {
        $scope.itens = data;
    }, function(err) {
        $cordovaToast.show(err, 'short', 'center');
    });

    $scope.selecionarItem = function(item, check) {
        item.check = check;
        check ? $scope.contItens ++ : $scope.contItens --;
    }

    verificarItensSelecionados = function() {
        for (item of $scope.itens) {
            if (item.check) {
                if (item.quantidade && item.quantidade > 0) {
                    itensSelecionados.push({id: item.id, quantidade: item.quantidade});
                } else {
                    $cordovaToast.show('Exitem itens sem a quantidade informada ou com a quantidade inválida', 'short', 'center');
                    return false;
                }
            }
        }

        return true;
    }

    redirect = function(msg) {
        $cordovaToast.show(msg, 'short', 'center');
        $state.go('tab.lista', {atualizarLista: true});
    }

    $scope.salvarLista = function() {
        if (verificarItensSelecionados()) {
            if ($stateParams.novaLista) {
                db.insertLista(itensSelecionados)
                .then(function(res) {
                    redirect(res);
                }, function(err) {
                    $cordovaToast.show(err, 'short', 'center');
                });
            } else {
                db.insertListaItem(itensSelecionados, idLista)
                .then(function(res) {
                    redirect(res);
                }, function(err) {
                    $cordovaToast.show(err, 'short', 'center');
                });
            }
        }
    }

});