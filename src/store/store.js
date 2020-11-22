import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import info from './info.js';
import category from './category';
import goals from './goals';
import record from './record';
import g_record from './g_record';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null
  },
  mutations: {
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    }
  },
  getters: {
    error: s => s.error
  },
  modules: {
    auth, info, category, record, goals, g_record
  },
  actions: {
    async fetchCurrency() {
      const key = process.env.VUE_APP_FIXER;
      const res = await fetch(`http://data.fixer.io/api/latest?access_key=${key}&symbols=USD,EUR,RUB`);
      return await res.json();
    }
  }
})
