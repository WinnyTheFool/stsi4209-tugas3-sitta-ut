/**
 * app-modal.js — Vue Component <app-modal>
 * Rubrik 1.1: Vue Component & Template
 * Rubrik 1.3: Conditional v-if
 * Rubrik 1.8: Custom element, slot, emit event
 */

Vue.component('app-modal', {
  template: '#tpl-app-modal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Informasi'
    },
    confirmLabel: {
      type: String,
      default: 'Simpan'
    },
    showFooter: {
      type: Boolean,
      default: true
    }
  }
});
