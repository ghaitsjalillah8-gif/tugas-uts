# Toko Buku Tinta - Tugas UTS Pemrograman Web 1

Aplikasi web sederhana untuk pemesanan buku pada sebuah toko online. Tugas ini berfokus pada sisi front-end, sehingga seluruh data berasal dari variabel JavaScript pada file `js/data.js` (format Array JSON), bukan dari server atau database.

| | |
|---|---|
| **Nama** | Ghaits Jalillah |
| **Mata kuliah** | Pemrograman Web 1 |
| **Link web** | https://ghaitsjalillah8-gif.github.io/tugas-uts/ |
| **Repositori** | https://github.com/ghaitsjalillah8-gif/tugas-uts |

## Akun untuk Mencoba

| Email | Password |
|---|---|
| ghaits@toko.com | ghaits2026 |

Akun baru juga dapat dibuat lewat tombol **Daftar** di halaman login.

## Teknologi

- **HTML5 semantik**: `header`, `nav`, `main`, `section`, `footer`, `label`, serta atribut ARIA pada modal.
- **CSS eksternal**: satu file `css/style.css` untuk seluruh halaman, memakai variabel warna dan tata letak responsif.
- **JavaScript**: manipulasi DOM, validasi form, modal box, alert box, dan penyimpanan data sementara di `localStorage`.

## Struktur Folder

```
tugas-uts/
|-- index.html        (halaman login)
|-- dashboard.html
|-- stok.html
|-- checkout.html
|-- tracking.html
|-- css/
|   |-- style.css
|-- js/
|   |-- script.js
|   |-- data.js
|-- assets/
|   |-- logo.png
|-- img/
|   |-- buku1.png ... buku6.png
|-- screenshots/      (tangkapan layar untuk laporan ini)
```

Pemisahan file dibuat agar setiap bagian mudah dicari: struktur di HTML, tampilan di CSS, data di `data.js`, dan logika di `script.js`.

## Penjelasan Setiap Halaman

### 1. Halaman Login (`index.html`)

Pengguna memasukkan email dan password lalu menekan tombol **Login**.

- Email divalidasi formatnya dan password wajib diisi. Pesan error tampil tepat di bawah kolom yang salah.
- Data dicocokkan dengan `dataUser` pada `data.js` dan akun yang didaftarkan lewat modal. Jika tidak cocok, muncul alert: *"Email/password yang Anda masukkan salah"*.
- Jika berhasil, data pengguna disimpan di `sessionStorage` lalu pengguna diarahkan ke dashboard.
- Tombol **Lupa Password** dan **Daftar** membuka modal box. Pendaftaran memeriksa panjang nama, format email, email yang belum terpakai, password minimal 6 karakter, dan kecocokan konfirmasi password.

![Halaman login](screenshots/login.png)

![Modal daftar](screenshots/modal-daftar.png)

### 2. Dashboard (`dashboard.html`)

Menu utama setelah login.

- Salam dibuat dengan `new Date().getHours()`: pagi (sebelum 11.00), siang (sebelum 15.00), sore (sebelum 18.00), dan malam untuk jam selebihnya.
- Empat tombol navigasi: Informasi Stok/Katalog, Tracking Pengiriman, Laporan Pemesanan (menuju halaman pemesanan), dan History Transaksi.
- History Transaksi membuka modal berisi tabel pesanan yang pernah dibuat.
- Halaman ini dan halaman lain di dalam aplikasi hanya bisa dibuka setelah login. Jika belum login, pengguna dikembalikan ke halaman login.

![Dashboard](screenshots/dashboard.png)

### 3. Informasi Stok/Katalog (`stok.html`)

- Tabel dibuat secara dinamis dari konstanta `dataKatalogBuku` memakai `createElement` dan `appendChild`, bukan ditulis manual di HTML.
- Stok di bawah 10 ditandai merah agar mudah dikenali.
- Form **Tambah Stok Buku Baru** memvalidasi judul, penulis, harga (harus lebih dari 0), dan stok (bilangan bulat, minimal 0), lalu menambahkan baris baru ke tabel lewat DOM.
- Jika gambar sampul tidak ditemukan, otomatis diganti gambar pengganti.

![Katalog buku](screenshots/katalog.png)

### 4. Pemesanan (`checkout.html`)

- Pengguna memilih buku dan jumlah, lalu menambahkannya ke tabel pesanan. Jumlah dapat diubah langsung di tabel, baris dapat dihapus, dan total dihitung ulang otomatis.
- Form data pemesan dan pembayaran berisi nama, nomor HP (diawali 08, 10 sampai 13 digit), alamat (minimal 10 karakter), ekspedisi, dan metode pembayaran.
- Pesanan tidak bisa dibuat jika keranjang kosong atau ada isian yang tidak valid.
- Jika berhasil, sistem membuat nomor Delivery Order dan menampilkannya di modal. Pesanan disimpan sehingga muncul di History Transaksi dan bisa dilacak di halaman tracking.

![Pemesanan](screenshots/pemesanan.png)

![Pesanan berhasil](screenshots/pesanan-berhasil.png)

### 5. Informasi Pengiriman (`tracking.html`)

- Pengguna memasukkan Nomor Delivery Order lalu menekan **Cari**.
- Jika ditemukan, ditampilkan nama pemesan, status pengiriman, ekspedisi, tanggal kirim, jenis paket, dan total pembayaran.
- Status disimulasikan dengan progress bar dan daftar lima tahap (Pesanan Dibuat, Dikemas, Diserahkan ke Ekspedisi, Dalam Perjalanan, Diterima). Tahap yang sudah dilewati diberi warna.
- Jika nomor tidak ditemukan, muncul alert.
- Nomor DO contoh untuk dicoba: `DO2026001`, `DO2026002`, `DO2026003`, atau nomor dari pesanan yang baru dibuat.

![Tracking pengiriman](screenshots/tracking.png)

## Alur Berpikir Perancangan

1. **Membaca soal dan memecahnya per halaman.** Setiap halaman memiliki satu tujuan dan kebutuhan datanya sendiri.
2. **Merancang data lebih dulu.** `data.js` disusun terlebih dahulu (pengguna, katalog, status, pesanan contoh) karena semua halaman bergantung padanya.
3. **Menyusun kerangka HTML semantik.** Struktur ditulis tanpa memikirkan tampilan, lalu diberi `id` pada elemen yang akan dimanipulasi JavaScript.
4. **Membuat satu CSS bersama.** Warna dan komponen (tombol, tabel, modal, kartu) didefinisikan sekali dan dipakai ulang di semua halaman agar konsisten.
5. **Menulis JavaScript per fungsi.** Setiap halaman memiliki fungsi inisialisasi sendiri, sedangkan fungsi umum (modal, format rupiah, penyimpanan) dipakai bersama.
6. **Menambahkan validasi dan umpan balik.** Setiap form memberi pesan error yang menjelaskan apa yang salah, dan hasil aksi dikonfirmasi lewat alert atau modal.

## Kesesuaian dengan Kriteria Penilaian

| Kriteria | Penerapan |
|---|---|
| Struktur HTML semantik | Elemen `header`, `nav`, `main`, `section`, `footer`, label terhubung ke input |
| Desain CSS | Satu file eksternal, tema warna konsisten, responsif |
| JavaScript DOM | Tabel dinamis, tambah/ubah/hapus baris, progress bar, modal |
| Validasi form dan alert | Pesan error pada setiap form, alert saat login salah atau DO tidak ditemukan |
| Modularitas file | Pemisahan HTML, CSS, `script.js`, dan `data.js` |
| Kreativitas tambahan | Tema toko buku, peringatan stok tipis, pendaftaran akun, riwayat transaksi, pelacakan pesanan baru |

## Catatan

Data akun, buku, dan pesanan yang ditambahkan tersimpan di browser masing-masing pengguna (`localStorage`), bukan di server. Karena itu data yang dimasukkan satu pengguna tidak terlihat oleh pengguna lain. Untuk mengulang dari awal, hapus data situs lewat pengaturan browser.
