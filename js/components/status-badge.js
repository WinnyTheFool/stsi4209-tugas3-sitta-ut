/**
 * status-badge.js — Vue Component <status-badge>
 * Rubrik 1.1: Vue Component & Template
 * Rubrik 1.3: Conditional status (Aman, Menipis, Kosong)
 * Rubrik 1.6: Mouse hover event untuk tooltip catatanHTML
 * Rubrik 1.8: Custom element & property template
 */

Vue.component('status-badge', {
  template: '#tpl-status-badge',
  props: {
    qty: {
      type: Number,
      required: true
    },
    safety: {
      type: Number,
      required: true
    },
    catatan: {
      type: String,
      default: ''
    }
  }
});
