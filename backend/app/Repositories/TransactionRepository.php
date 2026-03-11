<?php

namespace App\Repositories;

use App\Models\Transaction;
use Illuminate\Support\Collection;

class TransactionRepository
{
    /**
     * Retorna todas las transacciones del usuario filtradas por mercado.
     */
    public function allByMercado(int $userId, string $mercado): Collection
    {
        return Transaction::query()
            ->where('user_id', $userId)
            ->where('mercado', $mercado)
            ->orderBy('fecha')
            ->get();
    }

    /**
     * Crea una transacción y retorna el modelo para la API.
     */
    public function store(int $userId, array $data): Transaction
    {
        return Transaction::create([
            'user_id'  => $userId,
            'ticker'   => $data['ticker'],
            'cantidad' => $data['cantidad'],
            'precio'   => $data['precio'],
            'fecha'    => $data['fecha'],
            'tipo'     => $data['tipo'],
            'mercado'  => $data['mercado'],
        ]);
    }
}
