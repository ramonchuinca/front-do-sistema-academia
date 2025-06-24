<template>
  <div class="admin-container">
    <h1>Bem-vindo ao Painel da Academy</h1>
    <p>Use o botão abaixo para iniciar o agendamento.</p>
    <button @click="$router.push('/login')">Iniciar Agendamento</button>
  </div>
</template>

<script>
export default {
  name: 'AdminPage'
}
</script>

<style scoped>
.admin-container {
  text-align: center;
  padding: 50px;
}
button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
