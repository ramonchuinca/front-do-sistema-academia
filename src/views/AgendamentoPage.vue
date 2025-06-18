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


<style scoped>
div {
  max-width: 450px;
  margin: 50px auto;
  padding: 30px 25px;
  background-color: #f9fbfd;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
}

input[type="date"],
select {
  width: 100%;
  padding: 10px 12px;
  margin: 12px 0 20px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
 
  font-size: 16px;
  transition: border 0.3s;
}

input[type="date"]:focus,
select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

p {
  font-size: 15px;
  margin-top: 10px;
  text-align: center;
}

p[style*="green"] {
  color: #28a745 !important;
  font-weight: 600;
}

p[style*="red"] {
  color: #dc3545 !important;
  font-weight: 600;
}
</style>
