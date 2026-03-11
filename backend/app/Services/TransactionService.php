<?php

namespace App\Services;

use App\Models\Transaction;
use App\Repositories\TransactionRepository;
use Illuminate\Support\Collection;

class TransactionService
{
    public function __construct(
        private TransactionRepository $repository,
    ) {}

    public function listByMercado(int $userId, string $mercado): Collection
    {
        return $this->repository->allByMercado($userId, $mercado);
    }

    public function create(int $userId, array $data): Transaction
    {
        return $this->repository->store($userId, $data);
    }
}
