import Vue from 'vue'

import commonComponent from './common'

const components = { ...commonComponent }

Object.keys(components).forEach(key => Vue.component(components[key].name, components[key]))
