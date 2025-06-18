<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="nome" placeholder="Nome" required />
      <input v-model="peso" placeholder="Peso" required type="number" />
      <input v-model="altura" placeholder="Altura" />
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return { nome: '', peso: '', altura: '' }
  },
  methods: {
    async login() {
      try {
        
        const res = await axios.post('http://localhost:8000/api/login', {
          nome: this.nome,
          peso: Number(this.peso),
          altura: Number(this.altura),
          
        })
        localStorage.setItem('token', res.data.token)
        this.$router.push('/agendamento')
      } catch (error) {
        console.log
      }
      }
  }
}
</script>
