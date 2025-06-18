<template>
  <div>
    <h2>Agendar Horário</h2>

    <input type="date" v-model="data" @change="carregarVagasRestantes" />
    <p v-if="vagasRestantes !== null">Vagas restantes: {{ vagasRestantes }}</p>

    <select v-model="hora">
      <option disabled value="">Selecione um horário</option>
      <option v-for="h in horariosDisponiveis" :key="h">{{ h }}</option>
    </select>

    <button @click="agendar">Agendar</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      data: '',
      hora: '',
      horariosDisponiveis: ['08:00', '08:20', '08:40', '09:00', '09:20'],
      vagasRestantes: null
    }
  },
  methods: {
    async carregarVagasRestantes() {
      if (!this.data) return

      const res = await axios.get(`http://localhost:8000/api/vagas-restantes?data=${this.data}`)
      this.vagasRestantes = res.data.vagas
    },

    async agendar() {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'))

        const payload = {
          data: this.data,
          hora: this.hora,
          usuario_id: usuario.id
        }

        const res = await axios.post('http://localhost:8000/api/agendar', payload)

        alert(res.data.message)
      } catch (err) {
        console.error(err)
        alert(err.response?.data?.message || 'Erro ao agendar.')
      }
    }
  }
}
</script>
