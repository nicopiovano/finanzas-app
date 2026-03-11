<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'ticker',
        'cantidad',
        'precio',
        'fecha',
        'tipo',
        'mercado',
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
