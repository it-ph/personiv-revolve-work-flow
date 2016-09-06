const elixir = require('laravel-elixir');

require('laravel-elixir-vue');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(mix => {
    mix
    	/* App Sass Bootstrap */
    	.sass('app.scss')

    	/* Vendor CSS */
		.styles('vendor/*.css', 'public/css/vendor.css')
    	
    	/* Vendor Scripts */
    	.scriptsIn('public/libraries', 'public/js/vendor.js')
    	
    	/* Application Sass */
    	.sass('app/app.scss', 'public/css/application.css')

        /* Shared Scripts */
        .scriptsIn('public/app/shared', 'public/js/shared.js')

        /* Admin Scripts */
        .scriptsIn('public/app/components/admin', 'public/js/admin.js')

        /* Artist Scripts */
        .scriptsIn('public/app/components/designer', 'public/js/designer.js')
});
