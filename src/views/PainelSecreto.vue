<template>
  <div>
    <h2>Painel do Administrador</h2>

    <div v-if="!autenticado" style="max-width: 400px; margin: auto;">
      <input
        v-model="senha"
        type="password"
        placeholder="Digite a senha"
        style="padding: 10px; width: 100%; margin-bottom: 10px;"
      />
      <button @click="loginAdmin" style="padding: 10px; width: 100%;">
        Entrar
      </button>
    </div>

    <div v-else>
      <table border="1" style="width: 100%; margin-top: 20px; border-collapse: collapse;">
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
            <td>{{ ag.usuario?.nome || 'Desconhecido' }}</td>
            <td>{{ ag.usuario?.peso || '-' }} kg</td>
            <td>{{ ag.usuario?.altura || '-' }} m</td>
            <td>{{ formatarData(ag.data) }}</td>
            <td>{{ ag.hora }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      senha: "",
      autenticado: false,
      agendamentos: [],
    };
  },
  methods: {
    loginAdmin() {
      if (this.senha === "admin123") {
        this.autenticado = true;
        this.carregarAgendamentos();
      } else {
        alert("Senha incorreta.");
      }
    },
    async carregarAgendamentos() {
      try {
        const res = await api.get("/agendamentos-com-usuarios");
        this.agendamentos = res.data;
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        alert("Erro ao carregar dados.");
      }
    },
    formatarData(data) {
      return new Date(data).toLocaleDateString();
    },
  },
};
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
