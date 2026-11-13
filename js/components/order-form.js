/**
 * order-form.js — Vue Component <order-form>
 * Rubrik 1.1: Vue Component & Template
 * Rubrik 1.2: v-bind, v-model, dynamic select, Vue Filter
 * Rubrik 1.3: v-show untuk preview paket
 * Rubrik 1.5: Watcher pilihan paket
 * Rubrik 1.6: Validasi form, penomoran DO otomatis (DO + Tahun + Sequence)
 */

Vue.component('order-form', {
  template: '#tpl-order-form',
  props: {
    pengirimanList: {
      type: Array,
      required: true
    },
    paketList: {
      type: Array,
      required: true
    },
    trackingRaw: {
      type: Array,
      required: true
    }
  },
  data: function() {
    var today = new Date().toISOString().split('T')[0];
    return {
      form: {
        nim: '',
        nama: '',
        ekspedisi: '',
        paketKode: '',
        tanggalKirim: today
      },
      errors: {},
      formError: '',
      selectedPaket: null,
      successMsg: ''
    };
  },
  // Rubrik 1.5: Watcher — memantau perubahan pilihan paket
  watch: {
    'form.paketKode': function(newKode) {
      if (!newKode) {
        this.selectedPaket = null;
        return;
      }
      var found = this.paketList.find(function(p) { return p.kode === newKode; });
      this.selectedPaket = found || null;
    }
  },
  computed: {
    // Generate nomor DO berikutnya secara otomatis: DO + Tahun + 3 Digit Sequence
    // Contoh: DO2025-001 -> DO2025-002
    nextDoNumber: function() {
      var currentYear = new Date().getFullYear();
      var maxSeq = 0;

      this.trackingRaw.forEach(function(item) {
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
            // Regex mencari pola DO<tahun>-<seq>
            var match = key.match(/DO(\d{4})-(\d+)/);
            if (match) {
              var seq = parseInt(match[2], 10);
              if (seq > maxSeq) {
                maxSeq = seq;
              }
            }
          }
        }
      });

      var nextSeq = maxSeq + 1;
      var seqPadded = String(nextSeq).padStart(3, '0');
      return 'DO' + currentYear + '-' + seqPadded;
    }
  },
  methods: {
    resetForm: function() {
      var today = new Date().toISOString().split('T')[0];
      this.form = {
        nim: '',
        nama: '',
        ekspedisi: '',
        paketKode: '',
        tanggalKirim: today
      };
      this.errors = {};
      this.formError = '';
      this.selectedPaket = null;
    },

    validate: function() {
      this.errors = {};
      var f = this.form;
      if (!f.nim || !f.nim.trim()) this.errors.nim = 'NIM Mahasiswa wajib diisi';
      if (!f.nama || !f.nama.trim()) this.errors.nama = 'Nama Mahasiswa wajib diisi';
      if (!f.ekspedisi) this.errors.ekspedisi = 'Pilih ekspedisi pengiriman';
      if (!f.paketKode) this.errors.paketKode = 'Pilih paket bahan ajar';
      if (!f.tanggalKirim) this.errors.tanggalKirim = 'Tanggal kirim wajib diisi';

      return Object.keys(this.errors).length === 0;
    },

    submitOrder: function() {
      if (!this.validate()) {
        this.formError = 'Mohon lengkapi semua isian formulir dengan benar.';
        return;
      }

      var newDoKey = this.nextDoNumber;
      var ekspedisiObj = this.pengirimanList.find(function(e) { return e.kode === this.form.ekspedisi; }.bind(this));
      var ekspedisiNama = ekspedisiObj ? ekspedisiObj.nama.split(' ')[0] : this.form.ekspedisi;

      var now = new Date();
      var hh = String(now.getHours()).padStart(2, '0');
      var min = String(now.getMinutes()).padStart(2, '0');
      var ss = String(now.getSeconds()).padStart(2, '0');
      var timeStr = this.form.tanggalKirim + ' ' + hh + ':' + min + ':' + ss;

      var newDoData = {};
      newDoData[newDoKey] = {
        nim: this.form.nim.trim(),
        nama: this.form.nama.trim(),
        status: 'Dalam Perjalanan',
        ekspedisi: ekspedisiNama,
        tanggalKirim: this.form.tanggalKirim,
        paket: this.form.paketKode,
        total: this.selectedPaket ? this.selectedPaket.harga : 0,
        perjalanan: [
          {
            waktu: timeStr,
            keterangan: 'Penerimaan di Loket Pendaftaran DO: UT Pusat'
          }
        ]
      };

      // Tambahkan ke array trackingRaw
      this.trackingRaw.push(newDoData);

      var self = this;
      this.successMsg = 'Delivery Order ' + newDoKey + ' berhasil diterbitkan!';
      this.resetForm();

      setTimeout(function() {
        self.successMsg = '';
        // Emit event ke parent untuk beralih ke tab tracking jika diinginkan
        self.$emit('order-created', newDoKey);
      }, 2500);
    }
  }
});
