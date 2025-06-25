<template>

  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Academy</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
         <li class="nav-item">
  <router-link class="nav-link btn-nav" to="/">Início</router-link>
</li>

          <!-- <li class="nav-item">
            <router-link class="nav-link" to="/sobre">Sobre</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contato">Contato</router-link>
          </li> -->
        </ul>
      </div>
    </div>
  </nav>




  <div class="agendamento-container">
    <h2>Agendar Horário</h2>

    <!-- DATA ---------------------------------------------------------------->
    <input
      type="date"
      v-model="data"
      @change="carregarVagasRestantes"
      class="input-data"
    />

    <!-- LISTA DE HORÁRIOS --------------------------------------------------->
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

        <span
          v-if="vagasRestantes[horario] > 0"
          class="texto-verde"
        >
          {{ vagasRestantes[horario] }} vaga(s)
        </span>

        <span v-else class="texto-vermelho">Indisponível</span>
      </div>
    </div>

    <!-- RESUMO -------------------------------------------------------------->
    <ul
      v-if="Object.keys(vagasRestantes).length"
      class="resumo-vagas"
    >
      <li v-for="(vagas, hora) in vagasRestantes" :key="hora">
        {{ hora }} – {{ vagas }} vaga(s)
      </li>
    </ul>

    <!-- BOTÃO AGENDAR ------------------------------------------------------->
    <button
      :disabled="!horaSelecionada"
      @click="agendar"
      class="btn-agendar"
    >
      Agendar {{ horaSelecionada || '' }}
    </button>

    <!-- BOTÕES EDITAR / CANCELAR (visíveis se já há agendamento) ------------>
    <div v-if="agendamentoDoDia" style="margin-top:18px">
      <button class="btn-editar" @click="editarAgendamento">
        Alterar para {{ horaSelecionada }}
      </button>

      <button class="btn-cancelar" @click="cancelarAgendamento">
        Cancelar agendamento
      </button>
    </div>
  </div>
</template>

<script>
import api from "../api";

export default {
  name: "AgendamentoPage",
  data() {
    return {
      data: "",
      horarios: ["08:00", "08:20", "08:40", "09:00", "09:20"],
      vagasRestantes: {},
      horaSelecionada: null,

      agendamentoDoDia: null,
      carregando: false,
    };
  },

  methods: {
    /* ------------------------------------------------------------------ */
    async carregarVagasRestantes() {
      if (!this.data) {
        this.vagasRestantes = {};
        this.horaSelecionada = null;
        this.agendamentoDoDia = null;
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

      await this.carregarMeuAgendamento();
    },

    /* ------------------------------------------------------------------ */
    async carregarMeuAgendamento() {
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
      if (!usuario._id || !this.data) {
        this.agendamentoDoDia = null;
        return;
      }

      try {
        this.carregando = true;
        const res = await api.get(
          `/meu-agendamento?data=${this.data}&usuario=${usuario._id}`
        );

        this.agendamentoDoDia = res.data;
        this.horaSelecionada = this.agendamentoDoDia?.hora || null;
      } catch (e) {
        console.error("Erro ao buscar meu agendamento:", e);
        this.agendamentoDoDia = null;
      } finally {
        this.carregando = false;
      }
    },

    /* ------------------------------------------------------------------ */
    selecionarHorario(h) {
      if (this.vagasRestantes[h] > 0) this.horaSelecionada = h;
    },

    /* ------------------------------------------------------------------ */
    async agendar() {
      if (!this.validarAntesDeSalvar()) return;

      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
      if (!usuario._id) {
        alert("Usuário não encontrado. Faça login novamente.");
        return;
      }

      try {
        const jaTem = await api.get("/meu-agendamento", {
          params: { data: this.data, usuario: usuario._id },
        });

        if (jaTem.data) {
          alert(
            "Você já possui um agendamento nesse dia. " +
              "Altere ou cancele o horário existente antes de criar outro."
          );
          this.agendamentoDoDia = jaTem.data;
          this.horaSelecionada = jaTem.data.hora;
          return;
        }
      } catch (e) {
        console.error("Falha ao checar agendamento existente:", e);
        alert("Erro ao validar agendamento existente. Tente novamente.");
        return;
      }

      try {
        await api.post("/agendar", {
          data: this.data,
          hora: this.horaSelecionada,
          usuario_id: usuario._id,
        });
        alert("Agendado com sucesso!");
        await this.carregarVagasRestantes();
      } catch (e) {
        console.error("Erro ao agendar:", e);
        alert(e.response?.data?.erro || "Erro ao agendar");
      }
    },

    /* ------------------------------------------------------------------ */
    async editarAgendamento() {
      if (!this.agendamentoDoDia) return;
      if (!this.horaSelecionada) {
        alert("Selecione o novo horário.");
        return;
      }

      try {
        await api.put(`/agendar/${this.agendamentoDoDia._id}`, {
          data: this.data,
          hora: this.horaSelecionada,
        });
        alert("Agendamento atualizado!");
        await this.carregarVagasRestantes();
      } catch (e) {
        console.error("Erro ao editar:", e);
        alert(e.response?.data?.erro || "Erro ao editar");
      }
    },

    /* ------------------------------------------------------------------ */
    async cancelarAgendamento() {
      if (!this.agendamentoDoDia) return;
      if (!confirm("Deseja cancelar seu agendamento?")) return;

      try {
        await api.delete(`/agendar/${this.agendamentoDoDia._id}`);
        alert("Agendamento cancelado.");
        this.agendamentoDoDia = null;
        this.horaSelecionada = null;
        await this.carregarVagasRestantes();
      } catch (e) {
        console.error("Erro ao cancelar:", e);
        alert(e.response?.data?.erro || "Erro ao cancelar");
      }
    },

    /* ------------------------------------------------------------------ */
    validarAntesDeSalvar() {
      if (!this.horaSelecionada) {
        alert("Selecione um horário disponível");
        return false;
      }
      if (!this.data) {
        alert("Selecione uma data.");
        return false;
      }

      const [a, m, d] = this.data.split("-").map(Number);
      const dateLocal = new Date(a, m - 1, d);
      const diaSemana = dateLocal.getDay();
      if (diaSemana === 0 || diaSemana === 6) {
        alert("Não é permitido agendar aos sábados ou domingos.");
        return false;
      }
      return true;
    },
  },
};
</script>


<style scoped>
/* --------- LAYOUT GERAL ------------------------------------------------ */
.agendamento-container {
  max-width: 540px;
  margin: 40px auto;
  padding: 32px 28px;
  border-radius: 16px;
  background: #0f172a;          /* slate-900 */
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  color: #e2e8f0;               /* slate-200 */
  font-family: "Inter", Arial, sans-serif;
}

/* Exemplo: estilo de botão para os links do navbar */
.nav-link.btn-nav {
  background-color: #0d6efd;
  color: #fff !important;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  font-weight: 500;
}

.nav-link.btn-nav:hover {
  background-color: #0b5ed7;
  color: #fff !important;
}




h2 {
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 28px;
  color: #f8fafc;               /* slate-50 */
}

/* --------- INPUT DATA -------------------------------------------------- */
.input-data {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #334155;    /* slate-700 */
  background: #1e293b;          /* slate-800 */
  color: #f1f5f9;
  font-size: 1rem;
  outline: none;
  transition: border .25s;
}

.input-data:focus {
  border-color: #38bdf8;        /* sky-400 */
}

/* --------- LISTA DE HORÁRIOS ------------------------------------------- */
.lista-horarios {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(110px,1fr));
  gap: 14px;
  margin: 28px 0 12px;
}

button {
  width: 100%;
  padding: 12px 0;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  letter-spacing: .3px;
  cursor: pointer;
  transition: transform .15s, background .25s;
}

/* status de cada horário */
.btn-disponivel {
  background: #2563eb;          /* blue-600 */
  color: #fff;
}
.btn-disponivel:hover {
  transform: translateY(-2px);
  background: #1d4ed8;          /* blue-700 */
}

.btn-selecionado {
  background: #22c55e;          /* green-500 */
  color: #fff;
  box-shadow: 0 0 0 3px #166534 inset;
}

.btn-indisponivel {
  background: #64748b;          /* slate-500 */
  color: #e2e8f0;
  cursor: not-allowed;
}

/* badges de vagas */
.texto-verde,
.texto-vermelho {
  font-size: .85rem;
  font-weight: 600;
  margin-top: 6px;
  display: inline-block;
}
.texto-verde  { color: #4ade80 }   /* green-400 */
.texto-vermelho { color: #f87171 } /* red-400 */

/* --------- RESUMO ------------------------------------------------------ */
.resumo-vagas {
  list-style: none;
  padding: 0;
  margin: 18px 0 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(160px,1fr));
  gap: 6px;
  font-size: .9rem;
}

/* --------- BOTÃO AGENDAR ---------------------------------------------- */
.btn-agendar {
  padding: 14px 0;
  border-radius: 12px;
  background: #38bdf8;          /* sky-400 */
  color: #0c0f15;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  transition: filter .2s;
}
.btn-agendar:hover:not(:disabled) {
  filter: brightness(1.12);
}
.btn-agendar:disabled {
  background: #334155;          /* slate-700 */
  color: #94a3b8;               /* slate-400 */
  cursor: not-allowed;
}

/* --------- BOTÕES EDITAR / CANCELAR ----------------------------------- */
.btn-editar,
.btn-cancelar {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  margin-right: 10px;
  transition: filter .2s;
}
.btn-editar  { background:#facc15; color:#0f172a; }   /* yellow-400 */
.btn-cancelar{ background:#dc2626; color:#f8fafc; }   /* red-600  */
.btn-editar:hover,
.btn-cancelar:hover { filter: brightness(1.1); }
</style>
