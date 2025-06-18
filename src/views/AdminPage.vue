<template>
  <div>
    <h2>Painel de Admin</h2>
    <table v-if="agendamentos.length">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Peso</th>
          <th>Altura</th>
          <th>Data</th>
          <th>Hora</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ag in agendamentos" :key="ag.id">
          <td>{{ ag.usuario.nome }}</td>
          <td>{{ ag.usuario.peso }}</td>
          <td>{{ ag.usuario.altura }}</td>
          <td>{{ ag.data }}</td>
          <td>{{ ag.hora }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Nenhum agendamento.</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return { agendamentos: [] }
  },
  async created() {
    try {
     const res = await axios.get('http://localhost:8000/api/admin/agendamentos', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
      this.agendamentos = res.data
    } catch (err) {
      alert('Acesso negado ou erro ao carregar agendamentos')
      this.$router.push('/login')
    }
  }
}
</script>
