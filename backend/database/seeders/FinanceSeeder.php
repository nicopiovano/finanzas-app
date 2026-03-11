<?php

namespace Database\Seeders;

use App\Models\DolarCompra;
use App\Models\Ingreso;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class FinanceSeeder extends Seeder
{
    /**
     * Datos mock de cada módulo para que las APIs devuelvan datos de ejemplo.
     */
    public function run(): void
    {
        $user = User::first();
        if (! $user) {
            return;
        }

        $userId = $user->id;

        // Transacciones (Cedears y Acciones) – mismo mock que el frontend
        $transactions = [
            ['ticker' => 'AAPL',  'cantidad' => 10,  'precio' => 150.5,  'fecha' => '2026-02-01', 'tipo' => 'compra', 'mercado' => 'cedear'],
            ['ticker' => 'GOOGL', 'cantidad' => 5,   'precio' => 2800,    'fecha' => '2026-02-05', 'tipo' => 'compra', 'mercado' => 'cedear'],
            ['ticker' => 'MSFT',  'cantidad' => 8,   'precio' => 380,     'fecha' => '2026-02-10', 'tipo' => 'compra', 'mercado' => 'cedear'],
            ['ticker' => 'AAPL',  'cantidad' => 3,   'precio' => 155,     'fecha' => '2026-02-15', 'tipo' => 'venta',  'mercado' => 'cedear'],
            ['ticker' => 'YPF',   'cantidad' => 100, 'precio' => 1250,   'fecha' => '2026-02-01', 'tipo' => 'compra', 'mercado' => 'accion'],
            ['ticker' => 'GGAL',  'cantidad' => 50,  'precio' => 3400,   'fecha' => '2026-02-08', 'tipo' => 'compra', 'mercado' => 'accion'],
            ['ticker' => 'PAM',   'cantidad' => 75,  'precio' => 890,    'fecha' => '2026-02-12', 'tipo' => 'compra', 'mercado' => 'accion'],
        ];

        foreach ($transactions as $t) {
            Transaction::create([
                'user_id'  => $userId,
                'ticker'   => $t['ticker'],
                'cantidad' => $t['cantidad'],
                'precio'   => $t['precio'],
                'fecha'    => $t['fecha'],
                'tipo'     => $t['tipo'],
                'mercado'  => $t['mercado'],
            ]);
        }

        // Compras de dólar
        $dolarCompras = [
            ['cantidad' => 1000, 'precio' => 985,  'fecha' => '2026-01-15'],
            ['cantidad' => 500,  'precio' => 1020, 'fecha' => '2026-02-01'],
            ['cantidad' => 800,  'precio' => 1035, 'fecha' => '2026-02-10'],
        ];

        foreach ($dolarCompras as $d) {
            DolarCompra::create([
                'user_id'  => $userId,
                'cantidad' => $d['cantidad'],
                'precio'   => $d['precio'],
                'fecha'    => $d['fecha'],
            ]);
        }

        // Ingresos
        $ingresos = [
            ['fecha' => '2026-02-01', 'monto' => 500000,  'origen' => 'banco',       'nota' => 'Salario enero'],
            ['fecha' => '2026-02-05', 'monto' => 85000,   'origen' => 'mercadopago', 'nota' => 'Freelance proyecto web'],
            ['fecha' => '2026-02-10', 'monto' => 120000,  'origen' => 'banco',       'nota' => 'Bono semestral'],
            ['fecha' => '2026-02-15', 'monto' => 45000,   'origen' => 'mercadopago', 'nota' => 'Venta usados'],
        ];

        foreach ($ingresos as $i) {
            Ingreso::create([
                'user_id' => $userId,
                'fecha'   => $i['fecha'],
                'monto'   => $i['monto'],
                'origen'  => $i['origen'],
                'nota'    => $i['nota'],
            ]);
        }
    }
}
