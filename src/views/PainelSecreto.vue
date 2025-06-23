<template>
  <div>
    <h2>Agendamentos do Mês</h2>

    <table v-if="agendamentos.length">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Peso</th>
          <th>Altura</th>
          <th>Telefone</th>
          <th>Data</th>
          <th>Hora</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ag in agendamentos" :key="ag._id">
          <td>{{ ag.usuario_id?.nome || '-' }}</td>
          <td>{{ ag.usuario_id?.peso || '-' }}</td>
          <td>{{ ag.usuario_id?.altura || '-' }}</td>
          <td>{{ ag.usuario_id?.telefone || '-' }}</td>
          <td>{{ formatarData(ag.data) }}</td>
          <td>{{ ag.hora }}</td>
          <td>
            <button @click="deletarAgendamento(ag._id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Nenhum agendamento encontrado neste mês.</p>
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
    formatarData(dataStr) {
      const data = new Date(dataStr);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    },

    async carregarAgendamentos() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/painel-secreto-agendamentos`);
        console.log("🔍 Dados recebidos:", response.data);
        this.agendamentos = response.data;
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      }
    },

    async deletarAgendamento(id) {
      if (!confirm("Deseja excluir este agendamento?")) return;

      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/agendamento/${id}`);
        alert("Agendamento excluído!");
        this.carregarAgendamentos();
      } catch (error) {
        console.error("Erro ao excluir agendamento:", error);
        alert("Erro ao excluir. Verifique o console.");
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
  border: 1px solid #ccc;
  padding: 8px;
}
</style>
