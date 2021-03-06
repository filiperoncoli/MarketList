angular.module('dbModule', [])

.service('db', function($cordovaSQLite, $q, $rootScope) {

    this.insertItem = function(item) {
        var deferred = $q.defer();
        var query = "INSERT INTO item (descricao, unidade_medida, unidade_apresentacao, qt_unidade_apresentacao) VALUES (?,?,?,?)";
        var values = [item.descricao, item.unidade_medida, item.unidade_apresentacao, item.qt_unidade_apresentacao];

        $cordovaSQLite.execute($rootScope.db, query, values)
        .then(function(res) {
            deferred.resolve('Item salvo com sucesso');
        }, function(err) {
            console.log(err);
            deferred.reject('Erro ao salvar item');
        });

        return deferred.promise;
    }

    tratarResponse = function(res) {
        if (res.rows.length > 0) {
            var retorno = [];

            for (var index = 0; index < res.rows.length; index++) {
                retorno.push(res.rows.item(index));
            };

            return retorno;
        } else {
            return [];
        }
    }

    this.selectItens = function(idLista) {
        var deferred = $q.defer();
        var query = "";
        var values = [];

        if (idLista) {
            query = "SELECT id, descricao, unidade_medida, unidade_apresentacao, qt_unidade_apresentacao FROM item " +
                    "WHERE id NOT IN (SELECT id_item FROM lista_item WHERE id_lista = ?)";
            values = [idLista];
        } else {
            query = "SELECT id, descricao, unidade_medida, unidade_apresentacao, qt_unidade_apresentacao FROM item";
        }

        $cordovaSQLite.execute($rootScope.db, query, values)
        .then(function(res) {
            deferred.resolve(tratarResponse(res));
        }, function(err) {
            console.log(err);
            deferred.reject('Erro ao buscar itens');
        });

        return deferred.promise;
    }

    this.deleteItem = function(idItem) {
        var deferred = $q.defer();
        var query = "DELETE FROM item WHERE id = ?";
        var values = [idItem];

        $cordovaSQLite.execute($rootScope.db, query, values)
        .then(function(res) {
            deferred.resolve('Item excluído com sucesso');
        }, function(err) {
            console.log(err);
            deferred.reject('Erro ao excluir item');
        });

        return deferred.promise;
    }

    this.updateItem = function(item) {
        var deferred = $q.defer();
        var query = "UPDATE item SET descricao = ?, unidade_medida = ?, unidade_apresentacao = ?, qt_unidade_apresentacao = ? WHERE id = ?";
        var values = [item.descricao, item.unidade_medida, item.unidade_apresentacao, item.qt_unidade_apresentacao, item.id];

        $cordovaSQLite.execute($rootScope.db, query, values)
        .then(function(res) {
            deferred.resolve('Item alterado com sucesso');
        }, function(err) {
            console.log(err);
            deferred.reject('Erro ao alterar item');
        });

        return deferred.promise;
    }

    selectMaxLista = function() {
        var deferred = $q.defer();
        var query = "SELECT MAX(id) AS id FROM lista";

        $cordovaSQLite.execute($rootScope.db, query, [])
        .then(function(res) {
            if (res.rows.length > 0) {
                for (var index = 0; index < res.rows.length; index++) {
                    var retorno = res.rows.item(index).id;
                };

                deferred.resolve(retorno);
            } else {
                deferred.resolve(0);
            }
        }, function(err) {
            console.log(err);
            deferred.reject('Erro ao buscar o ID da lista');
        });

        return deferred.promise;
    }

    insertTabelaListaItem = function(itens, idLista) {
        var deferred = $q.defer();
        var query = "INSERT INTO lista_item (id_item, id_lista, in_checado, quantidade) VALUES ";
        var values = [];
        var cont = 1;

        for (item of itens) {
            if (cont === itens.length) {
                query += "(?,?,?,?);";
            } else {
                query += "(?,?,?,?), ";
            }
            
            values.push(item.id);
            values.push(idLista);
            values.push('N');
            values.push(item.quantidade);
            cont += 1;
        }

        $cordovaSQLite.execute($rootScope.db, query, values)
        .then(function(res) {
            deferred.resolve();
        }, function(err) {
            console.log(err);
            deferred.reject();
        });

        return deferred.promise;
    }

    this.insertLista = function(itens) {
        var deferred = $q.defer();
        var query = "INSERT INTO lista (in_finalizada) VALUES (?)";

        $cordovaSQLite.execute($rootScope.db, query, ['N'])
        .then(function(res) {
            selectMaxLista()
            .then(function(res) {
                var idLista = res;

                if (idLista > 0) {
                    insertTabelaListaItem(itens, idLista)
                    .then(function() {
                        deferred.resolve('Lista de compras salva com sucesso');
                    }, function() {
                        deferred.reject('Erro ao salvar lista de compras');
                    });
                } else {
                    deferred.reject('Erro ao salvar lista de compras');
                }
            }, function(err) {
                deferred.reject(err);
            });
        }, function(err) {
            console.log(err);
            deferred.reject('Erro ao salvar lista de compras');
        });

        return deferred.promise;
    }

    this.insertListaItem = function(itens, idLista) {
        var deferred = $q.defer();

        insertTabelaListaItem(itens, idLista)
        .then(function() {
            deferred.resolve('Lista de compras atualizada com sucesso');
        }, function() {
            deferred.reject('Erro ao atualizar lista de compras');
        });

        return deferred.promise;
    }

    this.selectListaAtual = function() {
        var deferred = $q.defer();
        var query = "SELECT id_item, i.descricao, i.unidade_medida, i.unidade_apresentacao, " +
                    "i.qt_unidade_apresentacao, id_lista, in_checado, quantidade, preco_unitario " +
                    "FROM lista_item li INNER JOIN lista l ON li.id_lista = l.id " +
                    "INNER JOIN item i ON li.id_item = i.id " +
                    "WHERE l.in_finalizada = 'N' AND id_lista = (SELECT MAX(id) FROM lista)";

        $cordovaSQLite.execute($rootScope.db, query, [])
        .then(function(res) {
            var listaAtual = tratarResponse(res);
            var totalConta = 0;

            if (listaAtual.length) {
                for (item of listaAtual) {
                    item.in_checado === 'S' ? item.check = true : item.check = false;

                    if (item.check && item.preco_unitario) {
                        totalConta += (item.preco_unitario * item.quantidade);
                    }
                }
            }

            deferred.resolve({itensLista: listaAtual, totalConta: totalConta});
        }, function(err) {
            console.log(err);
            deferred.reject('Erro ao buscar lista');
        });

        return deferred.promise;
    }

    this.deleteListaItem = function(idItem, idLista) {
        var deferred = $q.defer();
        var query = "DELETE FROM lista_item WHERE id_item = ? AND id_lista = ?";
        var values = [idItem, idLista];

        $cordovaSQLite.execute($rootScope.db, query, values)
        .then(function(res) {
            deferred.resolve('Item excluído da lista com sucesso');
        }, function(err) {
            console.log(err);
            deferred.reject('Erro ao excluir item');
        });

        return deferred.promise;
    }

    this.updateLista = function(lista) {
        var deferred = $q.defer();
        var query = "UPDATE lista SET dt_compra = ?, in_finalizada = ? WHERE id = ?";
        var values = [lista.dt_compra, lista.in_finalizada, lista.id];

        $cordovaSQLite.execute($rootScope.db, query, values)
        .then(function(res) {
            deferred.resolve();
        }, function(err) {
            console.log(err);
            deferred.reject('Erro ao atualizar lista');
        });

        return deferred.promise;
    }

    deleteListaCascade = function(idLista) {
        var deferred = $q.defer();
        var query = "DELETE FROM lista WHERE id = ?";
        var values = [idLista];

        $cordovaSQLite.execute($rootScope.db, query, values)
        .then(function(res) {
            deferred.resolve(res);
        }, function(err) {
            console.log(err);
            deferred.reject('Erro ao excluir lista');
        });

        return deferred.promise;
    }

    this.deleteLista = function(idLista) {
        var deferred = $q.defer();
        var query = "DELETE FROM lista_item WHERE id_lista = ?";
        var values = [idLista];

        $cordovaSQLite.execute($rootScope.db, query, values)
        .then(function(res) {
            deleteListaCascade(idLista)
            .then(function(res) {
                deferred.resolve('Lista excluída com sucesso');
            }, function(err) {
                console.log(err);
                deferred.reject('Erro ao excluir lista');
            });
        }, function(err) {
            console.log(err);
            deferred.reject('Erro ao excluir lista');
        });

        return deferred.promise;
    }

    this.updateListaItem = function(listaItem) {
        var deferred = $q.defer();
        var query = "UPDATE lista_item SET in_checado = ?, quantidade = ?, preco_unitario = ? " +
                    "WHERE id_item = ? AND id_lista = ?";
        var values = [listaItem.in_checado, listaItem.quantidade, listaItem.preco_unitario, listaItem.id_item, listaItem.id_lista];

        $cordovaSQLite.execute($rootScope.db, query, values)
        .then(function(res) {
            deferred.resolve();
        }, function(err) {
            console.log(err);
            deferred.reject('Erro ao atualizar itens');
        });

        return deferred.promise;
    }

    tratarDatas = function(listasFinalizadas) {
        for (lista of listasFinalizadas) {
            lista.dt_compra = new Date(lista.dt_compra);
        }
    }

    this.selectListasFinalizadas = function() {
        var deferred = $q.defer();
        var query = "SELECT id_lista, SUM(li.preco_unitario * li.quantidade) AS valor_total, dt_compra " +
                    "FROM lista_item li INNER JOIN lista l ON li.id_lista = l.id WHERE in_finalizada = 'S' " +
                    "GROUP BY id_lista, dt_compra ORDER BY id_lista ASC";

        $cordovaSQLite.execute($rootScope.db, query, [])
        .then(function(res) {
            var listas = tratarResponse(res);
            tratarDatas(listas);
            deferred.resolve(listas);
        }, function(err) {
            console.log(err);
            deferred.reject('Erro ao buscar histórico de listas');
        });

        return deferred.promise;
    }

});