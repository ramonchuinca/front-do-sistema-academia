<template>
  <div class="painel">
    <div v-if="autorizado">
      <h2>Painel de Agendamentos</h2>
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
            <td>{{ ag.usuario.peso }} kg</td>
            <td>{{ ag.usuario.altura }} m</td>
            <td>{{ ag.data }}</td>
            <td>{{ ag.hora }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>Nenhum agendamento encontrado.</p>
    </div>

    <div v-else>
      <h2>Área restrita</h2>
      <input v-model="senha" placeholder="Digite a chave de acesso" />
      <button @click="validar">Entrar</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      senha: '',
      autorizado: false,
      agendamentos: [],
      chaveCorreta: 'acesso123', // Altere aqui sua chave privada
    }
  },
  methods: {
    validar() {
      if (this.senha === this.chaveCorreta) {
        this.autorizado = true
        this.carregarAgendamentos()
      } else {
        alert('Chave incorreta')
      }
    },
    async carregarAgendamentos() {
      try {
        const res = await axios.get('http://localhost:8000/api/painel-secreto-agendamentos?token=meu-token-super-secreto-123')
        this.agendamentos = res.data
      } catch (err) {
        alert('Erro ao carregar os agendamentos')
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
.painel {
  padding: 2rem;
}
input {
  padding: 0.5rem;
  margin-right: 1rem;
}
button {
  padding: 0.5rem 1rem;
}
table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 0.5rem;
}
</style>
