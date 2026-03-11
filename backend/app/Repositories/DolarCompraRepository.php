<?php

namespace App\Repositories;

use App\Models\DolarCompra;
use Illuminate\Support\Collection;

class DolarCompraRepository
{
    public function all(int $userId): Collection
    {
        return DolarCompra::query()
            ->where('user_id', $userId)
            ->orderBy('fecha')
            ->get();
    }

    public function store(int $userId, array $data): DolarCompra
    {
        return DolarCompra::create([
            'user_id'  => $userId,
            'cantidad' => $data['cantidad'],
            'precio'   => $data['precio'],
            'fecha'    => $data['fecha'],
        ]);
    }
}
