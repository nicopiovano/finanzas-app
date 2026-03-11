<?php

namespace App\Services;

use App\Models\DolarCompra;
use App\Repositories\DolarCompraRepository;
use Illuminate\Support\Collection;

class DolarCompraService
{
    public function __construct(
        private DolarCompraRepository $repository,
    ) {}

    public function list(int $userId): Collection
    {
        return $this->repository->all($userId);
    }

    public function create(int $userId, array $data): DolarCompra
    {
        return $this->repository->store($userId, $data);
    }
}
