import { createApp } from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './assets/css/font.css'
import 'leaflet/dist/leaflet.css'





createApp(App).use(store).use(router).mount('#app')
