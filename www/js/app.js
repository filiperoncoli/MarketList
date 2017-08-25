angular.module('app', [
	'ionic',
	'routes',
	'config',
	'sqliteModule',
	'listaModule',
	'itensModule',
	'historicoModule',
	'cadastroItemModule',
	'novaListaModule'
])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}

		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
});
