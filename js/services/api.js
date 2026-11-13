/**
 * api.js — Data Service
 * Mengambil data dari dataBahanAjar.json menggunakan fetch()
 * Rubrik 1.1: Pemisahan service layer
 */

const DataService = {
  /**
   * Mengambil seluruh data dari dataBahanAjar.json
   * @returns {Promise<Object>} data lengkap
   */
  fetchAll() {
    return fetch('./data/dataBahanAjar.json')
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Gagal memuat data: ' + response.status);
        }
        return response.json();
      });
  }
};
