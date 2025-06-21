<template>
  <div class="painel">
    <h2>Painel de Agendamentos</h2>

    <div v-if="carregando">Carregando agendamentos...</div>
    <div v-else-if="agendamentos.length === 0">Nenhum agendamento encontrado.</div>
    
   <table>
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
    <tr v-for="ag in agendamentos" :key="ag._id">
      <td>{{ ag.usuario_id?.nome || 'Desconhecido' }}</td>
      <td>{{ ag.usuario_id?.peso || '-' }} kg</td>
      <td>{{ ag.usuario_id?.altura || '-' }} m</td>
      <td>{{ formatarData(ag.data) }}</td>
      <td>{{ ag.hora }}</td>
    </tr>
  </tbody>
</table>
<p v-if="erro">{{ erro }}</p>

  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      agendamentos: [],
      erro: null,
    }
  },
  async mounted() {
    try {
      // Adicione o token para acessar o painel
      const token = '12345'; // mesma senha do backend.env
      const res = await api.get(`/painel?token=${token}`);
      this.agendamentos = res.data;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      this.erro = 'Não foi possível carregar os agendamentos.';
    }
  },
  methods: {
  formatarData(data) {
  if (!data) return '-';
  return new Date(data).toLocaleDateString('pt-BR');
}
    
  }
  
}

</script>

<style scoped>
.painel {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

thead {
  background-color: #007bff;
  color: white;
}

td, th {
  padding: 12px;
  border: 1px solid #ccc;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
