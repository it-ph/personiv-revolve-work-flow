designerModule
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('main', {
				url: '/',
				views: {
					'': {
						templateUrl: '/app/shared/views/main.view.html',
						controller: 'mainViewController',
					},
					'content-container@main': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'sharedDashboardContentContainerController',
					},
					'toolbar@main': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main': {
						templateUrl: '/app/shared/templates/subheaders/dashboard-subheader.template.html',
					},
					'content@main':{
						templateUrl: '/app/shared/templates/content/dashboard-content.template.html',
					}
				}
			})
			.state('main.tracker', {
				url: 'tracker',
				views: {
					'content-container':{
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'trackerContentContainerController',
					},
					'toolbar@main.tracker': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.tracker': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.tracker': {
						templateUrl: '/app/shared/templates/subheaders/tracker-subheader.template.html',
					},
					'content@main.tracker':{
						templateUrl: '/app/shared/templates/content/tracker-content.template.html',
					},
				}
			})
			.state('main.notifications', {
				url: 'notifications',
				views: {
					'content-container':{
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'sharedNotificationsContentContainerController',
					},
					'toolbar@main.notifications': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.notifications': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.notifications':{
						templateUrl: '/app/shared/templates/content/notifications-content.template.html',
					},
				}
			})
			.state('main.task', {
				url: 'task/{taskID}',
				views: {
					'content-container':{
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'taskContentContainerController',
					},
					'toolbar@main.task': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.task': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.task':{
						templateUrl: '/app/shared/templates/content/task-content.template.html',
					},
				}
			})
	}]);