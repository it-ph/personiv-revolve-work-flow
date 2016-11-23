<!DOCTYPE html>
<html lang="en" ng-app="loginModule">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Revolve Tracker | Personiv</title>
	<!-- Favicon -->
    <link rel="shortcut icon" href="/img/2Color-Favicon_512x512-1-raw.png">
	<!-- Goolge Fonts Roboto -->
	<link href='https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic' rel='stylesheet' type='text/css'>
	<!-- Vendor CSS -->
	<link rel="stylesheet" href="/css/vendor.css">
	<!-- Application CSS -->
	<link rel="stylesheet" href="/css/application.css">
</head>
<body>
	<!-- Main View -->
	<div class="main-view no-opacity" ng-controller="homePageController" ng-init="show()" id="main">
		<md-content flex layout="column" layout-align="center center" class="full-height-min main-content">
			<a href="/">
				<img show-gt-md hide-md hide-sm src="/img/2Color-Logo_247px-1024x195_white.png" alt="Personiv Logo" class="personiv-logo">
				<img show-sm show-md hide-gt-md src="/img/2Color-Favicon_512x512-1-raw_white.png" alt="" class="personiv-logo">
			</a>
			<br>
			@if (count($errors) > 0)
			    <div class="alert alert-danger">
			        <ul>
			            @foreach ($errors->all() as $error)
			                <li>{{ $error }}</li>
			            @endforeach
			        </ul>
			    </div>
			@endif
			@yield('content')
		</md-content>
	</div>
	<!-- Vendor Scripts -->
	<script src="/js/vendor.js"></script>

	<script>
		var loginModule = angular.module('loginModule', ['ngMaterial', 'ngMessages',]);

		loginModule
			.config(['$mdThemingProvider', function($mdThemingProvider){
				/* Defaul Theme Blue - Light Blue */
				$mdThemingProvider.theme('default')
					.primaryPalette('blue')
					.accentPalette('deep-purple')
			}]);

		loginModule
			.controller('homePageController', ['$scope', function($scope){
				$scope.show = function(){
					angular.element(document.querySelector('.main-view')).removeClass('no-opacity');
				};
			}]);
	</script>
</body>
</html>