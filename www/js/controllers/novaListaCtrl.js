angular.module('novaListaModule', ['dbModule'])

.controller('novaListaCtrl', function($scope, $cordovaToast, db) {

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

    verificaItensSelecionados = function() {
        var itensSelecionados = [];

        for (item of $scope.itens) {
            if (item.check) {
                itensSelecionados.push({id: item.id, quantidade: item.quantidade});
            }
        }

        return itensSelecionados;
    }

    $scope.salvarLista = function() {
        var itensSelecionados = verificaItensSelecionados();

        db.insertLista(itensSelecionados)
        .then(function(res) {
            $cordovaToast.show(res, 'short', 'center');
        }, function(err) {
            $cordovaToast.show(err, 'short', 'center');
        });
    }

});