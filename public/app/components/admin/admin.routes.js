adminModule
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
						controller: 'dashboardContentContainerController',
					},
					'toolbar@main': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main': {
						templateUrl: '/app/components/admin/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main':{
						templateUrl: '/app/components/admin/templates/content/content.template.html',
					}
				}
			})
			.state('main.settings', {
				url: 'settings',
				views: {
					'content-container':{
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'settingsContentContainerController',
					},
					'toolbar@main.settings': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.settings': {
						templateUrl: '/app/components/admin/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.settings': {
						templateUrl: '/app/components/admin/templates/subheaders/settings-subheader.template.html',
					},
					'content@main.settings':{
						templateUrl: '/app/components/admin/templates/content/settings-content.template.html',
					},
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
						templateUrl: '/app/components/admin/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.tracker': {
						templateUrl: '/app/components/admin/templates/subheaders/tracker-subheader.template.html',
					},
					'content@main.tracker':{
						templateUrl: '/app/components/admin/templates/content/tracker-content.template.html',
					},
				}
			})
	}]);