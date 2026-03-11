<?php

namespace App\Repositories;

use App\Models\Ingreso;
use Illuminate\Support\Collection;

class IngresoRepository
{
    public function all(int $userId): Collection
    {
        return Ingreso::query()
            ->where('user_id', $userId)
            ->orderBy('fecha')
            ->get();
    }

    public function store(int $userId, array $data): Ingreso
    {
        return Ingreso::create([
            'user_id' => $userId,
            'fecha'   => $data['fecha'],
            'monto'   => $data['monto'],
            'origen'  => $data['origen'],
            'nota'    => $data['nota'] ?? '',
        ]);
    }
}
