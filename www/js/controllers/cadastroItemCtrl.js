angular.module('cadastroItemModule', ['dbModule'])

.controller('cadastroItemCtrl', function($scope, $state, $stateParams, db, $cordovaToast) {

    $scope.unidadesMedida = [
        {id: 1, descricao: 'Pacote'},
        {id: 2, descricao: 'Caixa'},
        {id: 3, descricao: 'Frasco'},
        {id: 4, descricao: 'Tubo'},
        {id: 5, descricao: 'Garrafa'}
    ];
    $scope.unidadesApresentacao = [
        {id: 1, descricao: 'Quilogramas', simbolo: 'kg'},
        {id: 2, descricao: 'Gramas', simbolo: 'g'},
        {id: 3, descricao: 'Litros', simbolo: 'L'},
        {id: 3, descricao: 'Mililitros', simbolo: 'mL'}
    ];

    if ($stateParams.inCadastro) {
        $scope.titulo = 'Cadastro de Item';
        $scope.item = {
            unidade_medida: 'Pacote',
            unidade_apresentacao: 'kg'
        };
    } else {
        $scope.titulo = 'Editar Item';
        $scope.item = $stateParams.item;
    }

    $scope.salvar = function() {
        console.log($scope.item);

        if ($stateParams.inCadastro) {
            db.insertItem($scope.item)
            .then(function(res) {
                $cordovaToast.show(res, 'short', 'center')
                .then(function() {
                    $state.go('tab.itens');
                });
            }, function(err) {
                $cordovaToast.show(err, 'short', 'center');
            });
        } else {
            db.updateItem($scope.item)
            .then(function(res) {
                $cordovaToast.show(res, 'short', 'center')
                .then(function() {
                    $state.go('tab.itens');
                });
            }, function(err) {
                $cordovaToast.show(err, 'short', 'center');
            });
        }
    }

});