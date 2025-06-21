<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="nome" placeholder="Nome" required />
      <input
        v-model="peso"
        placeholder="Peso"
        required
        type="number"
        step="any"
      />
      <input
        v-model="altura"
        placeholder="Altura"
        required
        type="number"
        step="any"
      />
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      email: "",
      senha: "",
      nome: "",
      peso: "",
      altura: "",
    };
  },

 methods: {
  async login() {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        email: this.email,
        senha: this.senha,
      })
      // sucesso
    

        localStorage.setItem("usuario", JSON.stringify(res.data.usuario))

        alert("Login realizado com sucesso!");
        this.$router.push("/agendamento"); // <-- Adicione isso
      } catch (error) {
        console.error("Erro ao logar:", error);
        alert("Erro ao logar, verifique os dados");
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
  background-color: #f7f9fc;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

input[type="date"],
select {
  width: 100%;
  padding: 10px 12px;
  margin: 10px 0 20px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  background-color: white;
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
