<?php

namespace App\Http\Controllers;

use App\Services\DolarCompraService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DolarCompraController extends Controller
{
    public function __construct(
        private DolarCompraService $service,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        return response()->json(['data' => $this->service->list($userId)]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cantidad' => ['required', 'numeric', 'min:0.01'],
            'precio'   => ['required', 'numeric', 'min:0'],
            'fecha'    => ['required', 'date'],
        ]);

        $userId = $request->user()->id;
        $compra = $this->service->create($userId, $validated);

        return response()->json(['data' => $compra], 201);
    }
}
