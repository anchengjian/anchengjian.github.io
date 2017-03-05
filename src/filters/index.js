import Vue from 'vue'

import date from './date'
const filters = {
  date
}

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
