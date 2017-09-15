angular.module('routes', [])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    .state('tab.lista', {
        url: '/lista',
        params: {
            atualizarLista: false
        },
        views: {
            'tab-lista': {
                templateUrl: 'templates/lista.html',
                controller: 'listaCtrl'
            }
        }
    })

    .state('tab.itens', {
        cache: false,
        url: '/itens',
        views: {
            'tab-itens': {
                templateUrl: 'templates/itens.html',
                controller: 'itensCtrl'
            }
        }
    })

    .state('tab.historico', {
        url: '/historico',
        views: {
            'tab-historico': {
                templateUrl: 'templates/historico.html',
                controller: 'historicoCtrl'
            }
        }
    })
    
    .state('tab.cadastroitem', {
        url: '/cadastroitem',
        params: {
            inCadastro: true,
            item: {}
        },
        views: {
            'tab-itens': {
                templateUrl: 'templates/cadastroItem.html',
                controller: 'cadastroItemCtrl'
            }
        }
    })
    
    .state('tab.adicionaritens', {
        url: '/adicionaritens',
        cache: false,
        params: {
            novaLista: true
        },
        views: {
            'tab-lista': {
                templateUrl: 'templates/adicionarItens.html',
                controller: 'adicionarItensCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/tab/lista');

});