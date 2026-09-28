<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model {
    protected $table = 'transaksi';
    protected $primaryKey = 'id_transaksi';
    protected $fillable = ['id_user', 'tanggal', 'total', 'uang_bayar', 'kembalian', 'metode_pembayaran'];

    public function user() {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function detailTransaksi() {
        return $this->hasMany(DetailTransaksi::class, 'id_transaksi', 'id_transaksi');
    }
}