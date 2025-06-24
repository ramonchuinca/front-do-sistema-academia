<template>
  <div class="painel">
    <h2>Painel Secreto</h2>

    <div v-if="!autenticado">
      <p>Digite a senha para acessar:</p>
      <input v-model="senhaDigitada" type="password" placeholder="Senha" />
      <button @click="fazerLogin">Entrar</button>
      <p v-if="erro" class="erro">{{ erro }}</p>
    </div>

    <div v-else>
      <h3>Agendamentos do Mês</h3>
      <p v-if="erro" class="erro">{{ erro }}</p>
      <table v-if="agendamentos.length">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Peso</th>
            <th scope="col">Altura</th>
            <th scope="col">Telefone</th>
            <th scope="col">Data</th>
            <th scope="col">Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ag, index) in agendamentos" :key="index">
            <td>{{ ag.nome || '---' }}</td>
            <td>{{ ag.peso || '---' }}</td>
            <td>{{ ag.altura || '---' }}</td>
            <td>{{ ag.telefone || '---' }}</td>
            <td>{{ formatarData(ag.data) }}</td>
            <td>{{ ag.hora }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>Nenhum agendamento encontrado neste mês.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "PainelSecreto",
  data() {
    return {
      senhaDigitada: '',
      senhaCorreta: '123456',
      autenticado: false,
      agendamentos: [],
      erro: ''
    };
  },
  methods: {
    async fazerLogin() {
      if (this.senhaDigitada === this.senhaCorreta) {
        this.autenticado = true;
        this.erro = '';
        await this.carregarAgendamentos();
      } else {
        this.erro = 'Senha incorreta.';
      }
    },
   async carregarAgendamentos() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/painel-secreto-agendamentos`);
    console.log('🔍 Agendamentos recebidos:', response.data); // ADICIONE AQUI
    this.agendamentos = response.data;
    this.erro = '';
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    this.erro = 'Erro ao carregar agendamentos.';
  }
},

    formatarData(dataISO) {
      if (!dataISO) return '';
      return new Date(dataISO).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }
};
</script>

<style scoped>

.painel {
  padding: 2rem;
  font-family: Arial, sans-serif;
  color: aliceblue;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
}

input {
  margin-right: 0.5rem;
  padding: 0.4rem;
  max-width: 100%;
  box-sizing: border-box;
}

button {
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 1rem;
  min-width: 80px;
}

/* Tabela */
table {
  color: aliceblue;
  border-collapse: collapse;
  width: 100%;
  margin-top: 1rem;

  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  overflow: hidden;

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

th {
  background-color: green;
  font-weight: bold;
}

th, td {
  padding: 0.5rem;
  border: 1px solid #ccc;
  text-align: center;
  word-wrap: break-word; /* para evitar overflow */
}

/* Mensagem de erro */
.erro {
  color: red;
  margin-top: 10px;
  font-size: 0.9rem;
}

/* Media Queries para telas menores */
@media (max-width: 600px) {
  .painel {
    padding: 1rem;
  }

  input {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 100%;
  }

  button {
    width: 100%;
    font-size: 1.1rem;
  }

  table, th, td {
    font-size: 0.9rem;
  }

  th, td {
    padding: 0.4rem 0.3rem;
  }
}

</style>
