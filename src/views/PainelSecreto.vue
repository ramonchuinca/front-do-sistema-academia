<template>
  <div>
    <h2>Agendamentos de Hoje</h2>

    <table v-if="agendamentos.length">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Telefone</th>
          <th>Hora</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ag in agendamentos" :key="ag._id">
          <td>{{ ag.usuario_id?.nome || '-' }}</td>
          <td>{{ ag.usuario_id?.telefone || '-' }}</td>
          <td>{{ ag.hora }}</td>
          <td>
            <button @click="deletarAgendamento(ag._id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Nenhum agendamento hoje.</p>
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

  async deletarAgendamento(id) {
    const confirmar = confirm("Deseja realmente excluir este agendamento?");
    if (!confirmar) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/agendamento/${id}`);
      alert("Agendamento excluído com sucesso!");
      this.carregarAgendamentos(); // Atualiza a tabela
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      alert("Erro ao excluir. Tente novamente.");
    }
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
