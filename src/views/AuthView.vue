<template>
  <div class="login-container">
 
    <!-- Show the correct form -->
    <div class="auth-form">
      <LoginForm 
        v-if="activeTab === 'login'" 
        @switch-form="activeTab = $event"
      />
      <RegisterForm 
        v-if="activeTab === 'register'" 
        @switch-form="activeTab = $event"
      />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import LoginForm from '../components/Auth/LoginForm.vue'
import RegisterForm from '../components/Auth/RegisterForm.vue'

export default defineComponent({
  components: { LoginForm, RegisterForm },
  setup() {
    const activeTab = ref<'login' | 'register'>('login')
    return { activeTab }
  }
})
</script>

<style >
.auth-form {
  font-family: "Fira Sans", sans-serif;
  background: #f0f2f7;
  color: #333;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
