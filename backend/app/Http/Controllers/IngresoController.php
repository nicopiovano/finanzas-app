<?php

namespace App\Http\Controllers;

use App\Services\IngresoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IngresoController extends Controller
{
    public function __construct(
        private IngresoService $service,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        return response()->json(['data' => $this->service->list($userId)]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'fecha'  => ['required', 'date'],
            'monto'  => ['required', 'numeric', 'min:0.01'],
            'origen' => ['required', 'in:banco,mercadopago'],
            'nota'   => ['nullable', 'string', 'max:255'],
        ]);

        $userId = $request->user()->id;
        $ingreso = $this->service->create($userId, $validated);

        return response()->json(['data' => $ingreso], 201);
    }
}
