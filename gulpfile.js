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
    	/* Vendor CSS */
		.styles('vendor/*.css', 'public/css/vendor.css')
    	/* Vendor Scripts */
    	.scriptsIn('public/libraries', 'public/js/vendor.js')
});
