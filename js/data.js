// data.js - data dummy (pengganti database) dalam bentuk Array JSON
const dataUser = [
  { nama: "Ghaits Jalillah", email: "ghaits@toko.com", password: "ghaits2026" },
  { nama: "Siti Rahma", email: "siti@toko.com", password: "siti2026" }
];

const dataKatalogBuku = [
  { kode: "BK001", judul: "Pemrograman Web Dasar", penulis: "Andi Wijaya", kategori: "Teknologi", harga: 85000, stok: 24, gambar: "img/buku1.png" },
  { kode: "BK002", judul: "JavaScript untuk Pemula", penulis: "Rina Kartika", kategori: "Teknologi", harga: 95000, stok: 18, gambar: "img/buku2.png" },
  { kode: "BK003", judul: "Desain Antarmuka Modern", penulis: "Dimas Prakoso", kategori: "Desain", harga: 110000, stok: 9, gambar: "img/buku3.png" },
  { kode: "BK004", judul: "Algoritma dan Struktur Data", penulis: "Hendra Gunawan", kategori: "Teknologi", harga: 125000, stok: 14, gambar: "img/buku4.png" },
  { kode: "BK005", judul: "Manajemen Proyek TI", penulis: "Laras Ayu", kategori: "Bisnis", harga: 98000, stok: 6, gambar: "img/buku5.png" },
  { kode: "BK006", judul: "Basis Data Relasional", penulis: "Yusuf Hakim", kategori: "Teknologi", harga: 105000, stok: 20, gambar: "img/buku6.png" }
];

const statusPengiriman = ["Pesanan Dibuat", "Dikemas", "Diserahkan ke Ekspedisi", "Dalam Perjalanan", "Diterima"];

const dataTracking = [
  { noDO: "DO2026001", nama: "Ghaits Jalillah", ekspedisi: "JNE", tanggal: "2026-10-28", paket: "Reguler", total: 180000, status: 3, items: [] },
  { noDO: "DO2026002", nama: "Siti Rahma", ekspedisi: "SiCepat", tanggal: "2026-10-30", paket: "Express", total: 235000, status: 1, items: [] },
  { noDO: "DO2026003", nama: "Agus Pratama", ekspedisi: "J&T", tanggal: "2026-10-20", paket: "Reguler", total: 98000, status: 4, items: [] }
];
