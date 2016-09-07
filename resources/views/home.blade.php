<!DOCTYPE html>
<html lang="en" ng-app="{{$user->role}}">
<head>
	<meta charset="UTF-8">
	<meta name="theme-color" content="#2196F3" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Revolve Tracker | Personiv</title>
	<!-- Favicon -->
    <link rel="shortcut icon" href="/img/Personiv-Favicon.png">
	<!-- Goolge Fonts Roboto -->
	<link href='https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic' rel='stylesheet' type='text/css'>
	<!-- Vendor CSS -->
	<link rel="stylesheet" href="/css/vendor.css">
	<!-- Shared CSS -->
	<link rel="stylesheet" href="/css/application.css">
</head>
<body>
	<!-- Main View -->
	<div class="main-view" ui-view></div>
	<!-- Vendor Scripts -->
	<script src="/js/vendor.js"></script>
	<!-- Shared Scripts -->
	<script src="/js/shared.js"></script>
	<!-- {{$user->role}} Script -->
	<script src="/js/{{$user->role}}.js"></script>
</body>
</html>