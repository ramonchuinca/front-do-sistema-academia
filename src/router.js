import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './views/LoginPage.vue'
import AgendamentoPage from './views/AgendamentoPage.vue'
import AdminPage from './views/AdminPage.vue'
import PainelSecreto from './views/PainelSecreto.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/agendamento', component: AgendamentoPage },
  { path: '/admin', component: AdminPage },
  { path: '/painel', component: PainelSecreto },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
