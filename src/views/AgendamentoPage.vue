<template>
  <div>
    <h2>Agendar Horário</h2>

    <!-- Campo de data -->
    <input type="date" v-model="data" @change="carregarHorarios" />

    <!-- Dropdown de horários disponíveis -->
    <select v-model="hora">
      <option value="" disabled>Selecione um horário</option>
      <option v-for="h in horarios" :key="h" :value="h">
        {{ h }}
      </option>
    </select>

    <!-- Botão para agendar -->
    <button @click="agendar">Confirmar</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      data: '',
      hora: '',
      horarios: []
    }
  },
  methods: {
    // 🔄 Carregar horários disponíveis para a data selecionada
    async carregarHorarios() {
      if (!this.data) return

      try {
        const res = await axios.get(`http://localhost:8000/api/horarios-disponiveis/${this.data}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.horarios = res.data
        this.hora = '' // limpa o horário selecionado
      } catch (err) {
        console.error('Erro ao carregar horários:', err)
        alert('Erro ao buscar horários disponíveis.')
      }
    },

    // ✅ Agendar horário
    async agendar() {
      try {
        await axios.post('http://localhost:8000/api/agendar', {
          data: this.data,
          hora: this.hora,
          usuario_id:1
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        alert('Agendado com sucesso!')
      } catch (err) {
        console.error('Erro ao agendar:', err.response?.data)
        const errors = err.response?.data?.errors || err.response?.data?.erro
        if (errors) {
          const messages = typeof errors === 'object'
            ? Object.values(errors).flat().join('\n')
            : errors
          alert('Erro ao agendar:\n' + messages)
        } else {
          alert('Erro: ' + err.message)
        }
      }
    }
  }
}
</script>

