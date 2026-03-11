<?php

namespace App\Http\Controllers;

use App\Services\PrecioService;
use Illuminate\Http\JsonResponse;

class PrecioController extends Controller
{
    public function __construct(
        private PrecioService $service,
    ) {}

    public function index(): JsonResponse
    {
        return response()->json(['data' => $this->service->getCurrentPrices()]);
    }
}
