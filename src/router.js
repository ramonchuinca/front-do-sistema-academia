import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './views/LoginPage.vue'
import AgendamentoPage from './views/AgendamentoPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/agendamento', component: AgendamentoPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
