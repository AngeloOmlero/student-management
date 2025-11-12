<template>
  <div class="login-container">
    <div class="login-card">
    
      <h2 class="form-title">Register</h2>
      
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="username">Username</label>
          <input type="username" id="username" v-model="username" required>
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required>
        </div>

        <div class="input-group">
        <label for="role">Role</label>
        <select id="role" v-model="role" placeholder="Select Role" required>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        </div>
        <button class="submit-btn" type="submit">Register</button>
      </form>
    </div>
    <div class="footer">
      Already have an account? 
      <a href="#" @click.prevent="$emit('switch-form','login')">Login</a> 
    </div>
    </div>
</template>
<script lang="ts">

  import { ref } from 'vue';
  import  {useAuthStore} from '../../stores/auth.store';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'RegisterForm',
    emits: ['switch-form'],
    setup(_, { emit }) {
    const router = useRouter();
  
      const authStore = useAuthStore();
      
      const username = ref('');
      const password = ref('');
      const role = ref<'USER' | 'ADMIN' >('USER');

      const handleRegister = async () => {
        const payload = { username: username.value, password: password.value, role: role.value };
        try {
          await authStore.register(payload);
          alert('Registration successful!');
          router.push('/login');
        } catch (error) {
          alert('Registration failed. Please try again.');
        }
       
      }
      return { username, password, role, handleRegister, emit }
      }
    
  }
    
  
  </script>
  
<style scoped>
.login-container {
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  width: 400px;
  max-width: 95%;
  text-align: center;
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {opacity: 0; transform: translateY(-10%);}
  to {opacity: 1; transform: translateY(0);}
}

.form-title {
  font-size: 28px;
  color: #007bff;
  font-weight: 700;
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
  width: 100%; /* Ensures input stretches fully inside the container */
}

.input-group label {
  display: flex;
  font-weight: 600;
  margin-bottom: 6px;
  color: #555;
}

.input-group input,
.input-group select {
  width: 100%; /* Full width of parent */
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: 0.2s;

  /* Add box-sizing to include padding/border in width calculation */
  box-sizing: border-box;
}

.input-group input:focus,
.input-group select:focus {
  border-color: #007bff;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.3);
}

.submit-btn {
  width: 100%; /* Same width as inputs */
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,123,255,0.2);
  transition: 0.3s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,123,255,0.25);
}

.footer {
  margin-top: 1.8rem;
  font-size: 0.95rem;
  color: #555;
}

.footer a {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  transition: 0.3s;
}

.footer a:hover {
  text-decoration: underline;
}

/* Optional: role dropdown alignment */
#role-group {
  transition: all 0.3s ease;
  overflow: hidden;
}

</style>

  

