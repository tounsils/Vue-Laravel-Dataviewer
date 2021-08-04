<?php


Route::get('/', function () {
    return view('welcome');
});

//Vue Scafolding Routes
Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
//Vue Scafolding Routes Ends

Route::get('/customers', 'CustomerController')->name('customers');