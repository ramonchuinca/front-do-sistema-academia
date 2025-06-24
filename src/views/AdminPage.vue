<template>
  <div class="page-wrapper">
    <!-- Navbar (cor padrão ou personalizada) -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <!-- <img src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Logo" width="30" height="24" class="d-inline-block align-text-top me-2"> -->
          Academy
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" href="#">Início</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Sobre</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Contato</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Conteúdo da página -->
    <div class="admin-container">
      <h1>Bem-vindo ao Painel da Academy</h1>
      <p>Use o botão abaixo para iniciar o agendamento.</p>
      <button @click="$router.push('/login')">Iniciar Agendamento</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPage'
}
</script>

<style scoped>
/* Fundo geral da página com gradiente + imagem */
.page-wrapper {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
}

/* Centraliza conteúdo */
.admin-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 50px 20px;
  width: 100%;
  min-height: calc(100vh - 56px); /* altura da tela menos a navbar */
  backdrop-filter: brightness(1.1); /* deixa o conteúdo mais legível sobre a imagem */
}

/* Estilo do botão */
button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}
</style>

