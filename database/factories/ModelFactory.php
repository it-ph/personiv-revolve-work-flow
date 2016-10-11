<?php
use Carbon\Carbon;
/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(App\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => $faker->name,
        'email' => $faker->safeEmail,
        'password' => $password ?: $password = bcrypt('secret'),
        'remember_token' => str_random(10),
    ];
});

$factory->defineAs(App\User::class, 'mcoy', function ($faker) use ($factory) {
    return [
        'name' => 'Marco Paco',
        'email' => 'marco.paco@personiv.com',
        'password' => bcrypt('admin222526'),
        'role' => 'admin',
    ];
});

$factory->defineAs(App\User::class, 'don', function ($faker) use ($factory) {
    return [
        'name' => 'Don Abe',
        'email' => 'don.abe@personiv.com',
        'password' => bcrypt('!welcome10'),
        'role' => 'admin',
    ];
});

// Pending Task
$factory->defineAs(App\User::class, 'designer', function ($faker) use ($factory) {
    $task = $factory->raw(App\User::class);

    return array_merge($task, ['role' => 'designer']);
});



$factory->define(App\Task::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'delivery_date' => Carbon::parse('today')->toDateTimeString(),
        'live_date' => Carbon::parse('today')->addDay()->toDateTimeString(),
        'file_name' => str_random(10) .'.jpg',
        'client_id' => 1,
        'category_id' => 1,
    ];
});

// Pending Task
$factory->defineAs(App\Task::class, 'pending', function ($faker) use ($factory) {
    $task = $factory->raw(App\Task::class);

    return array_merge($task, ['status' => 'pending']);
});

// In progress Task
$factory->defineAs(App\Task::class, 'in_progress', function ($faker) use ($factory) {
    $task = $factory->raw(App\Task::class);

    return array_merge($task, ['status' => 'in_progress']);
});

$factory->defineAs(App\Task::class, 'for_qc', function ($faker) use ($factory) {
    $task = $factory->raw(App\Task::class);

    return array_merge($task, ['status' => 'for_qc']);
});

$factory->defineAs(App\Task::class, 'rework', function ($faker) use ($factory) {
    $task = $factory->raw(App\Task::class);

    return array_merge($task, ['status' => 'rework']);
});

$factory->defineAs(App\Task::class, 'complete', function ($faker) use ($factory) {
    $task = $factory->raw(App\Task::class);

    return array_merge($task, ['status' => 'complete']);
});