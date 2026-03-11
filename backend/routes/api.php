<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DolarCompraController;
use App\Http\Controllers\IngresoController;
use App\Http\Controllers\PrecioController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn() => response()->json(['ok' => true]));

Route::get('/email-exists', [AuthController::class, 'emailExists'])->middleware('guest');

Route::post('/register', [AuthController::class, 'register'])->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Transactions (cedears + acciones)
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);

    // Dólar compras
    Route::get('/dolar-compras', [DolarCompraController::class, 'index']);
    Route::post('/dolar-compras', [DolarCompraController::class, 'store']);

    // Ingresos
    Route::get('/ingresos', [IngresoController::class, 'index']);
    Route::post('/ingresos', [IngresoController::class, 'store']);

    // Precios actuales
    Route::get('/precios', [PrecioController::class, 'index']);
});
