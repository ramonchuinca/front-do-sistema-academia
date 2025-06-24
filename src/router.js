import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './views/LoginPage.vue'
import AgendamentoPage from './views/AgendamentoPage.vue'
import AdminPage from './views/AdminPage.vue'
import PainelSecreto from './views/PainelSecreto.vue'

const routes = [
  { path: '/', component: AdminPage }, // agora carrega AdminPage primeiro
  { path: '/login', component: LoginPage },
  { path: '/agendamento', component: AgendamentoPage },
  { path: '/painel', component: PainelSecreto },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
