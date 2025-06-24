<template>
  <div class="agendamento-container">
    <h2>Agendar Horário</h2>

    <input
      type="date"
      v-model="data"
      @change="carregarVagasRestantes"
      class="input-data"
    />

    <div v-if="data" class="lista-horarios">
      <div
        v-for="horario in horarios"
        :key="horario"
        class="horario-item"
      >
        <button
          :disabled="vagasRestantes[horario] <= 0"
          :class="{
            'btn-selecionado': horaSelecionada === horario,
            'btn-disponivel': vagasRestantes[horario] > 0 && horaSelecionada !== horario,
            'btn-indisponivel': vagasRestantes[horario] <= 0,
          }"
          @click="selecionarHorario(horario)"
        >
          {{ horario }}
        </button>
        <span v-if="vagasRestantes[horario] > 0" class="texto-verde">
          {{ vagasRestantes[horario] }} vaga(s) restante(s)
        </span>
        <span v-else class="texto-vermelho">Indisponível</span>
      </div>
    </div>

    <ul v-if="Object.keys(vagasRestantes).length" class="resumo-vagas">
      <li v-for="(vagas, hora) in vagasRestantes" :key="hora">
        {{ hora }} - {{ vagas }} vaga(s)
      </li>
    </ul>

    <button
      :disabled="!horaSelecionada"
      @click="agendar"
      class="btn-agendar"
    >
      Agendar {{ horaSelecionada || "" }}
    </button>
  </div>
</template>



<script>
import api from '../api'

export default {
  data() {
    return {
      data: "",
      horarios: ["08:00", "08:20", "08:40", "09:00", "09:20"],
      vagasRestantes: {},
      horaSelecionada: null,
    };
  },
  methods: {
    async carregarVagasRestantes() {
      if (!this.data) {
        this.vagasRestantes = {};
        this.horaSelecionada = null;
        return;
      }

      try {
        const res = await api.get(`/vagas-restantes?data=${this.data}`);
        this.vagasRestantes = res.data;
        this.horaSelecionada = null;
      } catch (error) {
        console.error("Erro ao carregar vagas restantes:", error);
        alert("Erro ao carregar vagas.");
      }
    },

    selecionarHorario(horario) {
      if (this.vagasRestantes[horario] > 0) {
        this.horaSelecionada = horario;
      }
    },

    // ✅ Método corrigido
    async agendar() {
      if (!this.horaSelecionada) {
        alert("Selecione um horário disponível");
        return;
      }

      if (!this.data) {
        alert("Selecione uma data.");
        return;
      }

      // Corrigido: checa dia da semana com segurança
      const [ano, mes, dia] = this.data.split('-').map(Number);
      const dataLocal = new Date(ano, mes - 1, dia);
      const diaSemana = dataLocal.getDay(); // 0 = domingo, 6 = sábado

      if (diaSemana === 0 || diaSemana === 6) {
        alert("Não é permitido agendar aos sábados ou domingos.");
        return;
      }

      const usuarioJSON = localStorage.getItem("usuario");
      if (!usuarioJSON) {
        alert("Usuário não encontrado. Faça login novamente.");
        return;
      }

      const usuario = JSON.parse(usuarioJSON);
      console.log('efetuado com sucesso',usuario)
      try {
        const payload = {
          data: this.data,
          hora: this.horaSelecionada,
          usuario_id: usuario._id,
        };
        const res = await api.post("/agendar", payload);
        alert(res.data.mensagem);
        this.carregarVagasRestantes();
        this.$router.push("/#");
      } catch (error) {
        console.error("Erro ao agendar:", error);
        alert(error.response?.data?.erro || "Erro ao agendar");
      }
    }
  },
};
</script>


<style scoped>

.agendamento-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
}

h2{
  color: #fff;
  font-weight: bold;
}

.input-data {
  padding: 10px;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.lista-horarios {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.horario-item {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

button {
  padding: 10px 15px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  color: white;
  font-weight: 600;
  min-width: 100px;
  transition: background-color 0.3s ease;
}

.btn-selecionado {
  background-color: #28a745;
  border: 2px solid #155724;
}

.btn-disponivel {
  background-color: #007bff;
}

.btn-disponivel:hover {
  background-color: #0056b3;
}

.btn-indisponivel {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.texto-verde {
  color: green;
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.6);
}

.texto-vermelho {
  color: red;
  font-weight: 600;
}

.resumo-vagas {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  font-weight: 600;
  color: #fff;
}

.btn-agendar {
  width: 100%;
  padding: 12px;
  font-weight: bold;
  font-size: 16px;
  background-color: #007bff;
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-agendar:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.btn-agendar:not(:disabled):hover {
  background-color: #0056b3;
}

</style>

