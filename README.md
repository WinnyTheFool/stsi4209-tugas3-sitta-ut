# STSI4209 Tugas Praktik 3 — Sistem Informasi Bahan Ajar & Tracking DO (SITTA Universitas Terbuka)

Repository ini berisi implementasi solusi **Tugas Praktik 3 Mata Kuliah STSI4209 (Pemrograman Berbasis Web)** Universitas Terbuka. Proyek ini merupakan refaktorisasi arsitektur dari Tugas 2 menjadi sistem modular berbasis **Vue Component**, **Vue Template**, dan **Global Filters** yang berpedoman 100% pada lembar soal `STSI4209 Soal Tugas 3.pdf` dan data resmi `dataBahanAjar.json`.

---

## 📁 Struktur Direktori Proyek

Struktur folder dibangun mengikuti spesifikasi resmi pada soal:

```text
tugas3-vue-ut/
├── index.html                   # Root mount (#app), tab routing, & x-template definitions
├── assets/
│   ├── css/
│   │   └── style.css            # Desain tampilan global & responsive styling
│   └── img/                     # Folder aset gambar (opsional)
├── data/
│   └── dataBahanAjar.json       # Sumber data acuan resmi format JSON
├── js/
│   ├── app.js                   # Inisialisasi Vue Root & Global Filters
│   ├── services/
│   │   └── api.js               # Service layer fetch() untuk data akses asinkron
│   └── components/
│       ├── status-badge.js      # Component <status-badge> (Indikator status + Tooltip hover)
│       ├── app-modal.js         # Component <app-modal> (Reusable modal dialog)
│       ├── stock-table.js       # Component <ba-stock-table> (Manajemen stok & filter)
│       ├── do-tracking.js       # Component <do-tracking> (Pelacakan status pengiriman)
│       └── order-form.js        # Component <order-form> (Formulir pemesanan & terbit DO)
└── templates/
    ├── status-badge.html        # Template HTML untuk status badge
    ├── app-modal.html           # Template HTML untuk modal
    ├── stock-table.html         # Template HTML untuk tabel stok
    ├── do-tracking.html         # Template HTML untuk pelacakan DO
    └── order-form.html          # Template HTML untuk formulir pemesanan DO
```

---

## 🎯 Pemenuhan Indikator Capaian Penilaian (Rubrik 1.1 s.d. 1.8)

### 1.1 Arsitektur & Struktur Proyek Vue.js (20 Poin)
- Pemisahan kode bersih dan modular: service layer (`api.js`), komponen terpisah (`js/components/`), styling (`assets/css/style.css`), dan data JSON (`data/dataBahanAjar.json`).
- Penggunaan penamaan komponen gaya **kebab-case** (`ba-stock-table`, `do-tracking`, `order-form`, `status-badge`, `app-modal`).
- Routing internal menggunakan **tab state** di root (`index.html`) dengan state: `'stok'` | `'tracking'` | `'order'`.

### 1.2 Data Binding, Directive, Array, & Filter (10 Poin)
- **Data Binding:** `v-model` untuk input dua arah pada form, `v-bind` (`:class`, `:disabled`, `:key`, `:value`) untuk binding atribut.
- **Directives:** `v-text` untuk kode modul dan nomor DO, `v-html` untuk render catatanHTML.
- **List Rendering:** `v-for` untuk iterasi data array stok, opsi UPBJJ, kategori, ekspedisi, dan riwayat perjalanan DO.
- **Vue Filters Global:**
  - `formatRupiah`: Memformat angka harga ke mata uang Rupiah (contoh: `65000` → `Rp 65.000`).
  - `formatBuah`: Menambahkan satuan "(buah)" pada kolom Qty dan Safety Stock (contoh: `28` → `28 buah`).
  - `formatTanggal`: Mengubah format tanggal ISO menjadi bahasa Indonesia (contoh: `2025-08-25` → `25 Agustus 2025`).

### 1.3 Penggunaan Conditional (7 Poin)
- `v-if`, `v-else-if`, dan `v-else` pada status stok:
  - **Aman** (Hijau): `qty >= safety`.
  - **Menipis** (Orange/Warning): `qty < safety`.
  - **Kosong** (Merah/Bahaya): `qty === 0`.
- `v-show` pada filter kategori (dependent option yang hanya muncul jika UT-Daerah telah dipilih) dan preview detail paket bahan ajar.

### 1.4 Computed Properties & Methods (10 Poin)
- `filteredSortedStok`: Computed property cerdas yang menangani filter multi-level dan pengurutan (judul/qty/harga) tanpa *recompute* berulang.
- `nextDoNumber`: Menghitung nomor DO baru secara otomatis dengan format: `DO + Tahun Berjalan + Sequence 3 Digit` (contoh: `DO2025-002`).
- Methods CRUD lengkap untuk pengelolaan data bahan ajar dan tracking.

### 1.5 Watchers (10 Poin)
- **Watcher 1 (`filterUpbjj`):** Memantau perubahan pilihan UT-Daerah untuk mereset filter Kategori secara otomatis.
- **Watcher 2 (`form.paketKode`):** Memantau perubahan pilihan paket pada formulir pemesanan untuk memperbarui pratinjau isi modul dan menghitung total biaya secara instan.

### 1.6 Form Input, Validasi, & Event Handler Mouse/Keyboard (20 Poin)
- **Keyboard Event Handler:**
  - Tekan tombol **Enter** di formulir tambah/edit stok untuk langsung menyimpan data.
  - Tekan tombol **Enter** pada kolom pencarian tracking untuk memulai pelacakan (berdasarkan Nomor DO atau NIM).
  - Tekan tombol **Esc** pada kolom pencarian untuk membersihkan/mereset hasil pencarian.
  - Tekan tombol **Enter** saat mengedit Qty/Safety secara *inline* di tabel untuk memperbarui nilai seketika.
- **Mouse Hover Event:**
  - Menampilkan *tooltip preview* `catatanHTML` saat kursor diarahkan (*hover*) ke kolom Status bahan ajar.
- **Validasi Sederhana:**
  - Memeriksa kelengkapan seluruh field wajib (`*`), mencegah duplikasi kode mata kuliah, serta validasi angka non-negatif.
- **Konfirmasi Penghapusan Data:**
  - Pop-up modal konfirmasi muncul sebelum data bahan ajar dihapus secara permanen.
- **Pembaruan Riwayat Pengiriman:**
  - Fitur penambahan log perjalanan DO baru dengan waktu yang terisi otomatis berdasarkan *local time* via objek `Date()`.

### 1.7 Kreativitas & Pengalaman Pengguna (8 Poin)
- Desain antarmuka bersih, elegan, dan profesional khas portal akademik Universitas Terbuka.
- Notifikasi feedback visual otomatis (flash alert) saat data berhasil ditambah, diedit, atau dihapus.
- Desain responsif yang nyaman digunakan baik di layar desktop maupun perangkat tablet/ponsel.

### 1.8 Penjelasan Video (15 Poin)
- Komentar kode terstruktur rapi pada setiap indikator rubrik untuk memudahkan alur presentasi rekaman video penjelasan (maksimal 15 menit).

---

## 🚀 Cara Menjalankan Proyek

Karena proyek ini menggunakan fitur `fetch()` untuk membaca `dataBahanAjar.json`, browser memerlukan HTTP server lokal (untuk mencegah batasan CORS file:// lokal):

1. **Menggunakan Python (Bawaan Sistem):**
   ```bash
   cd D:\tugas3-vue-ut
   python -m http.server 8080
   ```
   Buka browser pada URL: `http://localhost:8080`

2. **Menggunakan Ekstensi VS Code (Live Server):**
   - Buka folder `D:\tugas3-vue-ut` di VS Code.
   - Klik kanan file `index.html` lalu pilih **Open with Live Server**.

---

&copy; 2025/2026 Universitas Terbuka • Program Studi Sistem Informasi • Tugas Praktik 3 STSI4209
