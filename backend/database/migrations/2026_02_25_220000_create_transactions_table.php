<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('ticker');
            $table->decimal('cantidad', 14, 4);
            $table->decimal('precio', 14, 4);
            $table->date('fecha');
            $table->enum('tipo', ['compra', 'venta']);
            $table->enum('mercado', ['cedear', 'accion']);
            $table->timestamps();

            $table->index(['user_id', 'mercado']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
