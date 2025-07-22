<template>
  <form @submit.prevent="handleLogin">
    <div>
      <label for="email">Email</label>
      <input id="email" v-model="email" data-testid="email" />
    </div>

    <div>
      <label for="password">Mot de passe</label>
      <input
        id="password"
        v-model="password"
        type="password"
        data-testid="password"
      />
    </div>

    <button type="submit" data-testid="submit">Se connecter</button>

    <!-- Message d'erreur -->
    <p v-if="errorMessage" data-testid="error">{{ errorMessage }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleLogin() {
  try {
    const res = await $fetch('http://localhost:3001/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    alert('Bienvenue')
  } catch (err) {
    errorMessage.value =
      err?.data?.error || 'Erreur inconnue ou serveur injoignable'
  }
}
</script>
