/**
 * app.js — Inisialisasi Vue Root & Global Filters
 * Rubrik 1.1: Arsitektur Vue Component & Template
 * Rubrik 1.2: Formatting data teks menggunakan konsep Filter (formatRupiah, formatBuah, formatTanggal)
 * Rubrik 1.4: Tab routing state ('stok' | 'tracking' | 'order')
 */

// ==========================================
// 1. GLOBAL VUE FILTERS (Rubrik 1.2 & 1.7)
// ==========================================

/**
 * Filter: formatRupiah
 * Mengubah angka menjadi format mata uang Rupiah
 * Contoh: 65000 -> "Rp 65.000"
 */
Vue.filter('formatRupiah', function(value) {
  if (value === undefined || value === null || isNaN(value)) return 'Rp 0';
  var number = Number(value);
  return 'Rp ' + number.toLocaleString('id-ID');
});

/**
 * Filter: formatBuah
 * Menambahkan satuan "(buah)" pada jumlah stok atau safety stock
 * Contoh: 28 -> "28 buah"
 */
Vue.filter('formatBuah', function(value) {
  if (value === undefined || value === null || isNaN(value)) return '0 buah';
  return value + ' buah';
});

/**
 * Filter: formatTanggal
 * Memformat string tanggal (YYYY-MM-DD) menjadi format bahasa Indonesia
 * Contoh: "2025-08-25" -> "25 Agustus 2025"
 */
Vue.filter('formatTanggal', function(value) {
  if (!value) return '-';
  var bulanIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  var parts = String(value).split('-');
  if (parts.length === 3) {
    var thn = parts[0];
    var bln = parseInt(parts[1], 10) - 1;
    var tgl = parseInt(parts[2], 10);
    if (bln >= 0 && bln < 12) {
      return tgl + ' ' + bulanIndo[bln] + ' ' + thn;
    }
  }
  return value;
});

// ==========================================
// 2. VUE ROOT INSTANCE (Rubrik 1.1)
// ==========================================
var app = new Vue({
  el: '#app',
  data: {
    // Tab State: 'stok' | 'tracking' | 'order'
    currentTab: 'stok',

    // Loading & Error State
    isLoading: true,
    loadError: null,

    // Data Store yang dimuat via api.js fetch()
    upbjjList: [],
    kategoriList: [],
    pengirimanList: [],
    paketList: [],
    stokData: [],
    trackingRaw: []
  },
  created: function() {
    this.loadInitialData();
  },
  methods: {
    // Memuat data dari dataBahanAjar.json via DataService (fetch API)
    loadInitialData: function() {
      var self = this;
      self.isLoading = true;
      self.loadError = null;

      DataService.fetchAll()
        .then(function(data) {
          self.upbjjList = data.upbjjList || [];
          self.kategoriList = data.kategoriList || [];
          self.pengirimanList = data.pengirimanList || [];
          self.paketList = data.paket || [];
          self.stokData = data.stok || [];
          self.trackingRaw = data.tracking || [];
          self.isLoading = false;
        })
        .catch(function(err) {
          console.error('Gagal memuat JSON:', err);
          self.loadError = 'Gagal memuat data dari dataBahanAjar.json. Pastikan file tersedia.';
          self.isLoading = false;
        });
    },

    // Navigasi Tab
    switchTab: function(tabName) {
      this.currentTab = tabName;
    },

    // Handler ketika order baru selesai diterbitkan
    onOrderCreated: function(newDoKey) {
      this.currentTab = 'tracking';
    }
  }
});
