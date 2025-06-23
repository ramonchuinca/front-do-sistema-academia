<template>
  <div>
    <h2>Agendar Horário</h2>

    <input type="date" v-model="data" @change="carregarVagasRestantes" />

    <div v-if="data">
      <div
        v-for="horario in horarios"
        :key="horario"
        style="margin-bottom: 8px"
      >
        <button
          :disabled="vagasRestantes[horario] <= 0"
          :style="{
            backgroundColor:
              horaSelecionada === horario
                ? '#28a745'
                : vagasRestantes[horario] > 0
                ? '#007bff'
                : '#ccc',
            color: 'white',
            padding: '10px 15px',
            border: horaSelecionada === horario ? '2px solid #155724' : 'none',
            borderRadius: '6px',
            cursor: vagasRestantes[horario] > 0 ? 'pointer' : 'not-allowed',
            marginRight: '10px',
            transition: 'all 0.3s ease',
          }"
          @click="selecionarHorario(horario)"
        >
          {{ horario }}
        </button>
        <span v-if="vagasRestantes[horario] > 0" style="color: green">
          {{ vagasRestantes[horario] }} vaga(s) restante(s)
        </span>
        <span v-else style="color: red"> Indisponível </span>
      </div>
    </div>

    <!-- Novo bloco: lista com resumo das vagas -->
    <ul v-if="Object.keys(vagasRestantes).length" style="margin-top: 20px">
      <li v-for="(vagas, hora) in vagasRestantes" :key="hora">
        {{ hora }} - {{ vagas }} vaga(s)
      </li>
    </ul>

    <button
      :disabled="!horaSelecionada"
      @click="agendar"
      style="margin-top: 20px; width: 100%; padding: 12px; font-weight: bold"
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
        this.$router.push("/login");
      } catch (error) {
        console.error("Erro ao agendar:", error);
        alert(error.response?.data?.erro || "Erro ao agendar");
      }
    }
  },
};
</script>

