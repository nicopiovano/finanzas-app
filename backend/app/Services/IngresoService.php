<?php

namespace App\Services;

use App\Models\Ingreso;
use App\Repositories\IngresoRepository;
use Illuminate\Support\Collection;

class IngresoService
{
    public function __construct(
        private IngresoRepository $repository,
    ) {}

    public function list(int $userId): Collection
    {
        return $this->repository->all($userId);
    }

    public function create(int $userId, array $data): Ingreso
    {
        return $this->repository->store($userId, $data);
    }
}
