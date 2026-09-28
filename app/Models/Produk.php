<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Produk extends Model {
    protected $table = 'produk';
    protected $primaryKey = 'id_produk';
    protected $fillable = ['id_kategori', 'nama_produk', 'harga', 'stok', 'status'];

    public function kategori() {
        return $this->belongsTo(Kategori::class, 'id_kategori', 'id_kategori');
    }

    public function detailTransaksi() {
        return $this->hasMany(DetailTransaksi::class, 'id_produk', 'id_produk');
    }
}