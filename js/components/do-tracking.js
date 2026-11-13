/**
 * do-tracking.js — Vue Component <do-tracking>
 * Rubrik 1.1: Vue Component & Template
 * Rubrik 1.2: v-for, v-bind, v-model, v-text, Vue Filter
 * Rubrik 1.3: v-if, v-else, v-else-if
 * Rubrik 1.4: computed, methods
 * Rubrik 1.6: cari berdasarkan No. DO / NIM, Enter to search, Esc to reset, tambah status progress
 */

Vue.component('do-tracking', {
  template: '#tpl-do-tracking',
  props: {
    trackingRaw: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      searchKeyword: '',
      currentDoKey: '',
      currentDo: null,
      sudahMencari: false,
      newProgressDesc: ''
    };
  },
  computed: {
    // Normalisasi struktur tracking dari array of objects: [{ "DO2025-0001": {...} }, ...]
    // menjadi array flat: [{ key: "DO2025-0001", ...data }, ...]
    doList: function() {
      var result = [];
      var seen = {};

      this.trackingRaw.forEach(function(item) {
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
            // Hindari duplikasi jika ada key yang sama persis
            if (!seen[key]) {
              seen[key] = true;
              var entry = Object.assign({ key: key }, item[key]);
              result.push(entry);
            }
          }
        }
      });

      return result;
    }
  },
  created: function() {
    // Tampilkan data pertama secara default jika ada
    if (this.doList.length > 0) {
      this.currentDoKey = this.doList[0].key;
      this.currentDo = this.doList[0];
    }
  },
  methods: {
    // Rubrik 1.6: Lacak via Enter atau tombol Lacak (berdasarkan No. DO atau NIM)
    lacak: function() {
      var query = this.searchKeyword.trim().toUpperCase();
      this.sudahMencari = true;

      if (!query) {
        this.currentDo = null;
        this.currentDoKey = '';
        return;
      }

      var found = this.doList.find(function(item) {
        var matchDo = item.key.toUpperCase() === query;
        var matchNim = item.nim && item.nim.trim() === query;
        return matchDo || matchNim;
      });

      if (found) {
        this.currentDoKey = found.key;
        this.currentDo = found;
      } else {
        this.currentDo = null;
        this.currentDoKey = '';
      }
    },

    // Rubrik 1.6: Reset pencarian via tombol Esc atau tombol Reset
    resetCari: function() {
      this.searchKeyword = '';
      this.sudahMencari = false;
      if (this.doList.length > 0) {
        this.currentDoKey = this.doList[0].key;
        this.currentDo = this.doList[0];
      } else {
        this.currentDo = null;
        this.currentDoKey = '';
      }
    },

    // Pilih DO dari tabel daftar
    pilihDo: function(key) {
      var found = this.doList.find(function(item) { return item.key === key; });
      if (found) {
        this.currentDoKey = found.key;
        this.currentDo = found;
        this.searchKeyword = found.key;
        this.sudahMencari = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    // Rubrik 1.6: Tambah status progress perjalanan pengiriman
    // Waktu diambil otomatis dari local time Date(), keterangan dari input user
    tambahProgress: function() {
      if (!this.currentDo) return;
      var desc = this.newProgressDesc.trim();
      if (!desc) {
        alert('Keterangan progress tidak boleh kosong!');
        return;
      }

      // Format local time: YYYY-MM-DD HH:mm:ss
      var now = new Date();
      var yyyy = now.getFullYear();
      var mm = String(now.getMonth() + 1).padStart(2, '0');
      var dd = String(now.getDate()).padStart(2, '0');
      var hh = String(now.getHours()).padStart(2, '0');
      var min = String(now.getMinutes()).padStart(2, '0');
      var ss = String(now.getSeconds()).padStart(2, '0');
      var timeStr = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;

      this.currentDo.perjalanan.push({
        waktu: timeStr,
        keterangan: desc
      });

      this.newProgressDesc = '';
    }
  }
});
