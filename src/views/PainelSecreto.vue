<template>
  <div>
    <h2>Agendamentos</h2>

    <table v-if="agendamentos.length">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Telefone</th>
          <th>Data</th>
          <th>Hora</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ag in agendamentos" :key="ag._id">
          <td>{{ ag.usuario_id?.nome || '-' }}</td>
          <td>{{ ag.usuario_id?.telefone || '-' }}</td>
          <td>{{ formatarData(ag.data) }}</td>
          <td>{{ ag.hora }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>Nenhum agendamento encontrado.</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PainelSecreto",
  data() {
    return {
      agendamentos: []
    };
  },
  methods: {
    async carregarAgendamentos() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/painel-secreto-agendamentos`);
        this.agendamentos = response.data;
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      }
    },
    formatarData(dataStr) {
      const data = new Date(dataStr);
      return data.toLocaleDateString('pt-BR');
    }
  },
  mounted() {
    this.carregarAgendamentos();
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 10px;
}

</style>
