/* script.js - satu file, dipisah per fungsi; halaman dikenali lewat <body data-page="..."> */
const $ = (s) => document.querySelector(s);
const rupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");
const simpan = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const ambil = (k) => JSON.parse(localStorage.getItem(k) || "[]");
const semuaUser = () => [...dataUser, ...ambil("userBaru")];
const semuaBuku = () => [...dataKatalogBuku, ...ambil("bukuBaru")];
const semuaPesanan = () => [...dataTracking, ...ambil("riwayat")];
const emailValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="64"><rect width="48" height="64" fill="#0E7C86"/><rect x="6" y="8" width="4" height="48" fill="#F2A541"/></svg>');

function bukaModal(id) { $("#" + id).hidden = false; }
function tutupModal(id) { $("#" + id).hidden = true; }
function pasangModal() {
  document.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", () => bukaModal(b.dataset.open)));
  document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => { b.closest(".modal").hidden = true; }));
}
function tampilError(id, pesan) { $("#" + id).textContent = pesan; }

/* ---------- LOGIN ---------- */
function initLogin() {
  $("#formLogin").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#email").value.trim(), pass = $("#password").value;
    tampilError("errEmail", emailValid(email) ? "" : "Format email tidak valid");
    tampilError("errPass", pass ? "" : "Password wajib diisi");
    if (!emailValid(email) || !pass) return;
    const user = semuaUser().find((u) => u.email === email && u.password === pass);
    if (!user) { alert("Email/password yang Anda masukkan salah"); return; }
    sessionStorage.setItem("user", JSON.stringify(user));
    location.href = "dashboard.html";
  });
  $("#formLupa").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#emailLupa").value.trim();
    if (!emailValid(email)) return tampilError("errLupa", "Masukkan email yang valid");
    tampilError("errLupa", "");
    if (semuaUser().some((u) => u.email === email)) { alert("Tautan reset password dikirim ke " + email); tutupModal("modalLupa"); }
    else tampilError("errLupa", "Email belum terdaftar");
  });
  $("#formDaftar").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = $("#namaDaftar").value.trim(), email = $("#emailDaftar").value.trim();
    const pass = $("#passDaftar").value, ulang = $("#passUlang").value;
    let err = "";
    if (nama.length < 3) err = "Nama minimal 3 karakter";
    else if (!emailValid(email)) err = "Format email tidak valid";
    else if (semuaUser().some((u) => u.email === email)) err = "Email sudah terdaftar";
    else if (pass.length < 6) err = "Password minimal 6 karakter";
    else if (pass !== ulang) err = "Konfirmasi password tidak sama";
    tampilError("errDaftar", err);
    if (err) return;
    simpan("userBaru", [...ambil("userBaru"), { nama, email, password: pass }]);
    alert("Pendaftaran berhasil, silakan login");
    e.target.reset(); tutupModal("modalDaftar");
  });
}

/* ---------- DASHBOARD ---------- */
function sapaan() {
  const j = new Date().getHours();
  return j < 11 ? "pagi" : j < 15 ? "siang" : j < 18 ? "sore" : "malam";
}
function initDashboard(user) {
  $("#greeting").textContent = `Selamat ${sapaan()}, ${user.nama}!`;
  $("#btnHistory").addEventListener("click", () => {
    const tbody = $("#bodyHistory"); tbody.innerHTML = "";
    const data = ambil("riwayat");
    if (!data.length) tbody.innerHTML = '<tr><td colspan="4">Belum ada transaksi. Buat pesanan di halaman Pemesanan.</td></tr>';
    data.forEach((p) => {
      const tr = document.createElement("tr");
      [p.noDO, p.tanggal, rupiah(p.total), statusPengiriman[p.status]].forEach((t) => {
        const td = document.createElement("td"); td.textContent = t; tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    bukaModal("modalHistory");
  });
}

/* ---------- STOK / KATALOG ---------- */
function barisBuku(b) {
  const tr = document.createElement("tr");
  const tdImg = document.createElement("td"), img = document.createElement("img");
  img.src = b.gambar || PLACEHOLDER; img.alt = "Sampul " + b.judul; img.width = 40;
  img.onerror = () => { img.onerror = null; img.src = PLACEHOLDER; };
  tdImg.appendChild(img); tr.appendChild(tdImg);
  [b.kode, b.judul, b.penulis, b.kategori, rupiah(b.harga), b.stok].forEach((t) => {
    const td = document.createElement("td"); td.textContent = t; tr.appendChild(td);
  });
  if (b.stok < 10) tr.classList.add("stok-tipis");
  return tr;
}
function initStok() {
  const tbody = $("#bodyStok");
  semuaBuku().forEach((b) => tbody.appendChild(barisBuku(b)));
  $("#formStok").addEventListener("submit", (e) => {
    e.preventDefault();
    const b = {
      kode: "BK" + String(semuaBuku().length + 1).padStart(3, "0"),
      judul: $("#judul").value.trim(), penulis: $("#penulis").value.trim(),
      kategori: $("#kategori").value, harga: Number($("#harga").value), stok: Number($("#stok").value), gambar: ""
    };
    let err = "";
    if (!b.judul || !b.penulis) err = "Judul dan penulis wajib diisi";
    else if (!(b.harga > 0)) err = "Harga harus lebih dari 0";
    else if (!Number.isInteger(b.stok) || b.stok < 0) err = "Stok harus bilangan bulat, minimal 0";
    tampilError("errStok", err);
    if (err) return;
    simpan("bukuBaru", [...ambil("bukuBaru"), b]);
    tbody.appendChild(barisBuku(b));
    e.target.reset();
    alert(`Buku "${b.judul}" berhasil ditambahkan`);
  });
}

/* ---------- CHECKOUT ---------- */
let keranjang = []; // { kode, judul, harga, qty }
function renderKeranjang() {
  const tbody = $("#bodyKeranjang"); tbody.innerHTML = "";
  let total = 0;
  keranjang.forEach((it, i) => {
    total += it.harga * it.qty;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${it.judul}</td><td>${rupiah(it.harga)}</td>
      <td><input type="number" min="1" value="${it.qty}" data-i="${i}" aria-label="Jumlah ${it.judul}"></td>
      <td>${rupiah(it.harga * it.qty)}</td><td><button type="button" class="btn kecil bahaya" data-hapus="${i}">Hapus</button></td>`;
    tbody.appendChild(tr);
  });
  if (!keranjang.length) tbody.innerHTML = '<tr><td colspan="5">Keranjang kosong. Pilih buku di atas.</td></tr>';
  $("#totalBelanja").textContent = rupiah(total);
  return total;
}
function initCheckout(user) {
  const pilih = $("#pilihBuku");
  semuaBuku().forEach((b) => pilih.add(new Option(`${b.judul} - ${rupiah(b.harga)}`, b.kode)));
  $("#nama").value = user.nama;
  renderKeranjang();
  $("#btnTambah").addEventListener("click", () => {
    const b = semuaBuku().find((x) => x.kode === pilih.value);
    const qty = Number($("#qty").value);
    if (!b) return tampilError("errItem", "Pilih buku terlebih dahulu");
    if (!(qty >= 1)) return tampilError("errItem", "Jumlah minimal 1");
    tampilError("errItem", "");
    const ada = keranjang.find((x) => x.kode === b.kode);
    if (ada) ada.qty += qty; else keranjang.push({ kode: b.kode, judul: b.judul, harga: b.harga, qty });
    renderKeranjang();
  });
  $("#bodyKeranjang").addEventListener("change", (e) => {
    if (e.target.dataset.i === undefined) return;
    keranjang[e.target.dataset.i].qty = Math.max(1, Number(e.target.value) || 1);
    renderKeranjang();
  });
  $("#bodyKeranjang").addEventListener("click", (e) => {
    if (e.target.dataset.hapus === undefined) return;
    keranjang.splice(e.target.dataset.hapus, 1); renderKeranjang();
  });
  $("#formCheckout").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = $("#nama").value.trim(), alamat = $("#alamat").value.trim(), hp = $("#hp").value.trim();
    let err = "";
    if (!keranjang.length) err = "Tambahkan minimal satu buku ke keranjang";
    else if (nama.length < 3) err = "Nama pemesan minimal 3 karakter";
    else if (alamat.length < 10) err = "Alamat minimal 10 karakter";
    else if (!/^08\d{8,11}$/.test(hp)) err = "Nomor HP harus diawali 08 dan 10-13 digit";
    else if (!$("#bayar").value) err = "Pilih metode pembayaran";
    tampilError("errCheckout", err);
    if (err) return;
    const ongkir = Number($("#ekspedisi").selectedOptions[0].dataset.ongkir);
    const total = renderKeranjang() + ongkir;
    const pesanan = {
      noDO: "DO" + Date.now().toString().slice(-7), nama, ekspedisi: $("#ekspedisi").value,
      tanggal: new Date().toISOString().slice(0, 10), paket: ongkir > 20000 ? "Express" : "Reguler",
      total, status: 0, items: keranjang
    };
    simpan("riwayat", [...ambil("riwayat"), pesanan]);
    $("#infoDO").textContent = `Nomor Delivery Order: ${pesanan.noDO} (total ${rupiah(total)}). Gunakan nomor ini di halaman Tracking.`;
    bukaModal("modalSukses");
    keranjang = []; renderKeranjang(); e.target.reset(); $("#nama").value = user.nama;
  });
}

/* ---------- TRACKING ---------- */
function initTracking() {
  $("#formTracking").addEventListener("submit", (e) => {
    e.preventDefault();
    const kode = $("#noDO").value.trim().toUpperCase(), hasil = $("#hasil");
    if (!kode) return tampilError("errDO", "Nomor Delivery Order wajib diisi");
    const p = semuaPesanan().find((x) => x.noDO === kode);
    tampilError("errDO", "");
    if (!p) { hasil.hidden = true; alert("Nomor Delivery Order tidak ditemukan"); return; }
    $("#rNama").textContent = p.nama;
    $("#rEkspedisi").textContent = p.ekspedisi;
    $("#rTanggal").textContent = p.tanggal;
    $("#rPaket").textContent = p.paket;
    $("#rTotal").textContent = rupiah(p.total);
    $("#rStatus").textContent = statusPengiriman[p.status];
    $("#bar").style.width = ((p.status + 1) / statusPengiriman.length) * 100 + "%";
    const ul = $("#langkah"); ul.innerHTML = "";
    statusPengiriman.forEach((s, i) => {
      const li = document.createElement("li");
      li.textContent = s; if (i <= p.status) li.className = "selesai";
      ul.appendChild(li);
    });
    hasil.hidden = false;
  });
}

/* ---------- INISIALISASI ---------- */
document.addEventListener("DOMContentLoaded", () => {
  pasangModal();
  const halaman = document.body.dataset.page;
  if (halaman === "login") return initLogin();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");
  if (!user) { location.href = "index.html"; return; }
  $("#btnLogout").addEventListener("click", () => { sessionStorage.removeItem("user"); location.href = "index.html"; });
  ({ dashboard: initDashboard, stok: initStok, checkout: initCheckout, tracking: initTracking })[halaman](user);
});
