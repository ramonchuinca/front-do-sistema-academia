<template>
  <div>
    <h2>FAÇA AQUI SEU AGENDAMENTO</h2>
    <form @submit.prevent="login">
      <input v-model="nome" placeholder="Nome" required />
      <input v-model="peso" placeholder="Peso" required type="number" step="any" />
      <input v-model="altura" placeholder="Altura" required type="number" step="any" />
      <input v-model="telefone" placeholder="Telefone" required /> <!-- ✅ NOVO CAMPO -->
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script>
import api from "../api"; // certifique-se que aponta para seu axios configurado
import { useRouter } from "vue-router";

export default {
  name: "LoginPage",
  data() {
    return {
      nome: "",
      peso: "",
      altura: "",
      telefone: "", // ✅ NOVO CAMPO NO DATA
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async login() {
      try {
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
          nome: this.nome,
          peso: this.peso,
          altura: this.altura,
          telefone: this.telefone, // ✅ NOVO CAMPO ENVIADO
        });

        if (response.data.usuario) {
          localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
          alert("Login feito com sucesso!");
          this.router.push("/agendamento");
        } else {
          alert("Usuário não encontrado");
        }
      } catch (error) {
        console.error("Erro ao logar:", error);
        alert("Erro ao fazer login. Verifique os dados ou tente novamente.");
      }
    },
  },
};
</script>

<style scoped>
div {
  max-width: 400px;
  margin: 40px auto;
  padding: 30px;
 background-color: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
  font-weight: bolder;
}

input[type="date"],
input,
select {
  width: 100%;
  padding: 10px 12px;
  margin: 10px 0 20px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
