angular.module('novaListaModule', ['dbModule'])

.controller('novaListaCtrl', function($scope, $rootScope, $state, $cordovaToast, db) {

    $scope.itens = [];

    db.selectItens()
    .then(function(data) {
        $scope.itens = data;
    }, function(err) {
        $cordovaToast.show(err, 'short', 'center');
    });

    $scope.checkar = function(item, checkado) {
        item.check = checkado;
    }

    verificarItensSelecionados = function() {
        var itensSelecionados = [];

        for (item of $scope.itens) {
            if (item.check) {
                itensSelecionados.push({id: item.id, quantidade: item.quantidade});
            }
        }

        return itensSelecionados;
    }

    $scope.salvarLista = function() {
        var itensSelecionados = verificarItensSelecionados();

        db.insertLista(itensSelecionados)
        .then(function(res) {
            db.selectListaAtual()
            .then(function(data) {
                $rootScope.listaAtual = data;
                $cordovaToast.show(res, 'short', 'center');
                $state.go('tab.lista');
            }, function(err) {
                $cordovaToast.show(err, 'short', 'center');
            });
        }, function(err) {
            $cordovaToast.show(err, 'short', 'center');
        });
    }

});