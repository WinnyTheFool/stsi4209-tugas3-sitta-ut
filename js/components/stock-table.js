/**
 * stock-table.js — Vue Component <ba-stock-table>
 * Rubrik 1.1: Vue Component & Template
 * Rubrik 1.2: v-for, v-bind, v-model, v-text, Vue Filter
 * Rubrik 1.3: v-if, v-else, v-show
 * Rubrik 1.4: computed, methods
 * Rubrik 1.5: watcher filterUpbjj (reset filterKategori)
 * Rubrik 1.6: event keyboard Enter, popup konfirmasi delete, inline edit
 */

Vue.component('ba-stock-table', {
  template: '#tpl-stock-table',
  props: {
    stokData: {
      type: Array,
      required: true
    },
    upbjjList: {
      type: Array,
      required: true
    },
    kategoriList: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      // Filter states
      filterUpbjj: '',
      filterKategori: '',
      filterReorder: false,
      sortBy: '',

      // Modal Tambah/Edit states
      showModal: false,
      isEditing: false,
      formError: '',
      form: {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: ''
      },
      errors: {},

      // Inline Edit state
      editingId: null,
      editQty: 0,
      editSafety: 0,

      // Delete confirm state
      showConfirmDelete: false,
      deleteTarget: null,

      // Feedback message
      successMsg: ''
    };
  },
  // Rubrik 1.5: Watcher — memantau perubahan filterUpbjj
  watch: {
    filterUpbjj: function(newVal, oldVal) {
      // Saat filter UT-Daerah berganti atau direset, reset filter kategori
      this.filterKategori = '';
    }
  },
  computed: {
    // Rubrik 1.4: Computed property untuk filter dan sort tanpa recompute berulang
    filteredSortedStok: function() {
      var self = this;
      var list = this.stokData.slice(); // Salin array agar tidak memutasi langsung

      // 1. Filter UT-Daerah
      if (this.filterUpbjj) {
        list = list.filter(function(item) {
          return item.upbjj === self.filterUpbjj;
        });
      }

      // 2. Filter Kategori Mata Kuliah (hanya aktif jika UT-Daerah dipilih)
      if (this.filterUpbjj && this.filterKategori) {
        list = list.filter(function(item) {
          return item.kategori === self.filterKategori;
        });
      }

      // 3. Filter Re-order: hanya tampilkan qty < safety ATAU qty = 0
      if (this.filterReorder) {
        list = list.filter(function(item) {
          return item.qty < item.safety || item.qty === 0;
        });
      }

      // 4. Sort berdasarkan opsi terpilih
      if (this.sortBy === 'judul') {
        list.sort(function(a, b) {
          return a.judul.localeCompare(b.judul);
        });
      } else if (this.sortBy === 'qty') {
        list.sort(function(a, b) {
          return a.qty - b.qty;
        });
      } else if (this.sortBy === 'harga') {
        list.sort(function(a, b) {
          return a.harga - b.harga;
        });
      }

      return list;
    }
  },
  methods: {
    // Reset Filter
    resetFilter: function() {
      this.filterUpbjj = '';
      this.filterKategori = '';
      this.filterReorder = false;
      this.sortBy = '';
    },

    // Notifikasi sukses otomatis hilang
    showFeedback: function(msg) {
      var self = this;
      this.successMsg = msg;
      setTimeout(function() {
        self.successMsg = '';
      }, 3000);
    },

    // Buka modal tambah
    openTambah: function() {
      this.isEditing = false;
      this.formError = '';
      this.errors = {};
      this.form = {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: 50000,
        qty: 10,
        safety: 5,
        catatanHTML: ''
      };
      this.showModal = true;
    },

    // Buka modal edit
    openEdit: function(item) {
      this.isEditing = true;
      this.formError = '';
      this.errors = {};
      this.form = {
        kode: item.kode,
        judul: item.judul,
        kategori: item.kategori,
        upbjj: item.upbjj,
        lokasiRak: item.lokasiRak,
        harga: item.harga,
        qty: item.qty,
        safety: item.safety,
        catatanHTML: item.catatanHTML || ''
      };
      this.showModal = true;
    },

    closeModal: function() {
      this.showModal = false;
    },

    // Validasi sederhana
    validateForm: function() {
      this.errors = {};
      var f = this.form;
      if (!f.kode || !f.kode.trim()) this.errors.kode = 'Kode MK wajib diisi';
      if (!f.judul || !f.judul.trim()) this.errors.judul = 'Judul MK wajib diisi';
      if (!f.kategori) this.errors.kategori = 'Kategori wajib dipilih';
      if (!f.upbjj) this.errors.upbjj = 'UT-Daerah wajib dipilih';
      if (!f.lokasiRak || !f.lokasiRak.trim()) this.errors.lokasiRak = 'Lokasi rak wajib diisi';
      if (f.harga === undefined || f.harga < 0) this.errors.harga = 'Harga tidak valid';
      if (f.qty === undefined || f.qty < 0) this.errors.qty = 'Qty tidak valid';
      if (f.safety === undefined || f.safety < 0) this.errors.safety = 'Safety stock tidak valid';

      return Object.keys(this.errors).length === 0;
    },

    // Rubrik 1.6: Submit form via Enter atau klik tombol
    submitForm: function() {
      if (!this.validateForm()) {
        this.formError = 'Mohon lengkapi semua field yang berbintang merah (*).';
        return;
      }

      if (this.isEditing) {
        // Update data existing
        var idx = this.stokData.findIndex(function(x) { return x.kode === this.form.kode; }.bind(this));
        if (idx !== -1) {
          // Mutasi reaktif Vue 2
          Vue.set(this.stokData, idx, Object.assign({}, this.form));
          this.showFeedback('Data bahan ajar ' + this.form.kode + ' berhasil diperbarui!');
        }
      } else {
        // Cek duplikasi kode MK
        var exists = this.stokData.some(function(x) { return x.kode === this.form.kode.trim().toUpperCase(); }.bind(this));
        if (exists) {
          this.formError = 'Kode MK ' + this.form.kode + ' sudah terdaftar!';
          return;
        }

        var newItem = Object.assign({}, this.form, {
          kode: this.form.kode.trim().toUpperCase()
        });
        this.stokData.push(newItem);
        this.showFeedback('Bahan ajar baru ' + newItem.kode + ' berhasil ditambahkan!');
      }

      this.closeModal();
    },

    // Inline edit langsung pada tabel (Rubrik 1.6: Enter untuk simpan)
    startInlineEdit: function(item, field) {
      this.editingId = item.kode;
      this.editQty = item.qty;
      this.editSafety = item.safety;
    },
    saveInlineEdit: function(item) {
      if (this.editQty < 0 || this.editSafety < 0) {
        alert('Nilai tidak boleh negatif');
        return;
      }
      item.qty = Number(this.editQty);
      item.safety = Number(this.editSafety);
      this.editingId = null;
      this.showFeedback('Stok ' + item.kode + ' berhasil diperbarui!');
    },
    cancelInlineEdit: function() {
      this.editingId = null;
    },

    // Konfirmasi dan hapus data (Rubrik 1.6: popup konfirmasi delete)
    konfirmasiHapus: function(item) {
      this.deleteTarget = item;
      this.showConfirmDelete = true;
    },
    hapusData: function() {
      if (!this.deleteTarget) return;
      var targetKode = this.deleteTarget.kode;
      var idx = this.stokData.findIndex(function(x) { return x.kode === targetKode; });
      if (idx !== -1) {
        this.stokData.splice(idx, 1);
        this.showFeedback('Bahan ajar ' + targetKode + ' berhasil dihapus.');
      }
      this.showConfirmDelete = false;
      this.deleteTarget = null;
    }
  }
});
