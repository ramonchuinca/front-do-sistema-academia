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
    </tr>
  </thead>
  <tbody>
    <tr v-for="ag in agendamentos" :key="ag._id">
  <td>{{ ag.usuario_id?.nome || '---' }}</td>
  <td>{{ ag.usuario_id?.peso || '---' }}</td>
  <td>{{ ag.usuario_id?.altura || '---' }}</td>
  <td>{{ ag.usuario_id?.telefone || '---' }}</td>
  <td>{{ formatarData(ag.data) }}</td>
  <td>{{ ag.hora }}</td>
</tr>

  </tbody>
</table>


    <p v-else>Nenhum agendamento encontrado neste mês.</p>
  </div>
</template>

<script>
import axios from "axios";
import api from "../api";

export default {
  name: "PainelSecreto",
  data() {
    return {
      agendamentos: [],
      data: '',
      hora: '',
      usuario: {
        _id: '' // ⚠️ deve ser preenchido pelo login ou outro meio
      }
    };
  },
  methods: {
    formatarData(data) {
      if (!data) return '';
      return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },

    async carregarAgendamentos() {
      try {

        const response = await api.get(`/painel-secreto-agendamentos`);
        
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
    },

    async criarAgendamentoSimples() {
      try {
        if (!this.usuario._id || !this.data || !this.hora) {
          alert("Preencha todos os campos.");
          return;
        }

        await axios.post('/api/agendar-simples', {
          usuario_id: this.usuario._id,
          data: this.data,
          hora: this.hora
        });

        alert("✅ Agendamento criado com sucesso!");
        this.carregarAgendamentos();
      } catch (error) {
        console.error("Erro ao criar agendamento:", error);
        alert("Erro ao criar agendamento. Verifique o console.");
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
