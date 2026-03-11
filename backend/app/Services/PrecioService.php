<?php

namespace App\Services;

class PrecioService
{
    /**
     * Retorna precios actuales hardcodeados.
     * Mismos valores que el frontend tenía en calculations.ts.
     */
    public function getCurrentPrices(): array
    {
        return [
            'cdrs' => [
                'AAPL'  => 158.5,
                'GOOGL' => 2850,
                'MSFT'  => 385,
            ],
            'acciones' => [
                'YPF'  => 1320,
                'GGAL' => 3580,
                'PAM'  => 910,
            ],
            'dolar' => [
                'oficial' => 890,
                'mep'     => 1045,
                'blue'    => 1050,
            ],
        ];
    }
}
