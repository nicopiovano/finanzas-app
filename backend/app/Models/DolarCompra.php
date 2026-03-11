<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DolarCompra extends Model
{
    protected $table = 'dolar_compras';

    protected $fillable = [
        'user_id',
        'cantidad',
        'precio',
        'fecha',
    ];

    protected function casts(): array
    {
        return [
            'fecha'    => 'date',
            'cantidad' => 'decimal:4',
            'precio'   => 'decimal:4',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
