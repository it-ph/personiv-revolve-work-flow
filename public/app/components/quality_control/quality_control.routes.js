qualityControlModule
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('main', {
				url: '/',
				views: {
					'': {
						templateUrl: '/app/shared/views/main.view.html',
						controller: 'sharedMainViewController',
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
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
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
			.state('main.upload', {
				url: 'upload',
				views: {
					'content-container':{
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'uploadContentContainerController',
					},
					'toolbar@main.upload': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.upload': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.upload':{
						templateUrl: '/app/components/admin/templates/content/upload-content.template.html',
					},
				}
			})
			.state('main.sheets', {
				url: 'sheets',
				views: {
					'content-container':{
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'sheetsContentContainerController',
					},
					'toolbar@main.sheets': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.sheets': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.sheets': {
						templateUrl: '/app/components/admin/templates/subheaders/sheets-subheader.template.html',
					},
					'content@main.sheets':{
						templateUrl: '/app/components/admin/templates/content/sheets-content.template.html',
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