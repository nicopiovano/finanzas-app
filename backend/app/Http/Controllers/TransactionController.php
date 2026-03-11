<?php

namespace App\Http\Controllers;

use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function __construct(
        private TransactionService $service,
    ) {}

    /**
     * GET /api/transactions?mercado=cedear|accion
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'mercado' => ['required', 'in:cedear,accion'],
        ]);

        $userId = $request->user()->id;
        $data = $this->service->listByMercado($userId, $request->query('mercado'));

        return response()->json(['data' => $data]);
    }

    /**
     * POST /api/transactions
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ticker'   => ['required', 'string', 'max:10'],
            'cantidad' => ['required', 'numeric', 'min:0.0001'],
            'precio'   => ['required', 'numeric', 'min:0'],
            'fecha'    => ['required', 'date'],
            'tipo'     => ['required', 'in:compra,venta'],
            'mercado'  => ['required', 'in:cedear,accion'],
        ]);

        $userId = $request->user()->id;
        $transaction = $this->service->create($userId, $validated);

        return response()->json(['data' => $transaction], 201);
    }
}
