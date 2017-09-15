angular.module('sqliteModule', ['ionic', 'ngCordova', 'dbModule'])

.run(function($ionicPlatform, $cordovaSQLite, $rootScope, db) {
    $ionicPlatform.ready(function() {
        //$cordovaSQLite.deleteDB({name: "market_list.db", iosDatabaseLocation: 'default'});

        $rootScope.db = $cordovaSQLite.openDB({name: "market_list.db", iosDatabaseLocation: 'default'});

        //$cordovaSQLite.execute($rootScope.db, 'DELETE FROM lista');

        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS item (" +
                                                "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, " +
                                                "descricao TEXT NOT NULL, " +
                                                "unidade_medida TEXT NOT NULL, " +
                                                "unidade_apresentacao TEXT NOT NULL, " +
                                                "qt_unidade_apresentacao DECIMAL(6,2) NOT NULL)")
        .then(function(res) {
            console.log("Tabela item criada com sucesso!");
        }, function(err) {
            console.log("Erro ao criar tabela item!");
            console.log(err);
        });

        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS lista_item (" +
                                                "id_item INTEGER NOT NULL, " + 
                                                "id_lista INTEGER NOT NULL, " + 
                                                "in_checado CHAR(1) NOT NULL DEFAULT 'N' CHECK (in_checado IN ('N','S')), " +
                                                "quantidade DECIMAL(6,2) NOT NULL, " +
                                                "preco_unitario DECIMAL(6,2), " +
                                                "PRIMARY KEY(id_item, id_lista), " +
                                                "FOREIGN KEY(id_item) REFERENCES item(id), " +
                                                "FOREIGN KEY(id_lista) REFERENCES lista(id))")
        .then(function(res) {
            console.log("Tabela lista criada com sucesso!");
        }, function(err) {
            console.log("Erro ao criar tabela lista!");
            console.log(err);
        });

        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS lista (" + 
                                                "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, " +
                                                "dt_compra DATE, " + 
                                                "in_finalizada CHAR(1) NOT NULL DEFAULT 'N' CHECK (in_finalizada IN ('N','S')))")
        .then(function(res) {
            console.log("Tabela compra criada com sucesso!");
        }, function(err) {
            console.log("Erro ao criar tabela compra!");
            console.log(err);
        });

        //Select tem que ser feito aqui pois a tela inicial carrega antes
        //de ser aberta a transação no banco de dados
        db.selectListaAtual()
        .then(function(data) {
            $rootScope.listaAtual = data.itensLista;
            $rootScope.totalConta = data.totalConta;
        }, function(err) {
            console.log(err);
        });
    })
});