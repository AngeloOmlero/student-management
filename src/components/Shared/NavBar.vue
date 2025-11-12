<template>
  <header class="navbar">
    <div class="logo-container">
      <img src="@/assets/images/apprentice.png" alt="logo" />
      <h1>Student Management</h1>
    </div>

    <nav class="nav-links">
      <router-link to="/dashboard" class="nav-item" exact>Dashboard</router-link>
      <router-link to="/students" class="nav-item">Students</router-link>
      <router-link to="/course" class="nav-item">Courses</router-link>
    </nav>

    <div class="nav-actions">
      <DarkModeToggle />
      <button class="logout-btn" @click="logout">Logout</button>
    </div>

    <!-- Mobile Menu Toggle -->
    <button class="menu-toggle" @click="toggleMenu">
      <span :class="{ open: isMenuOpen }"></span>
    </button>

    <!-- Mobile Nav -->
    <div class="mobile-nav" v-if="isMenuOpen">
      <router-link to="/dashboard" @click="closeMenu">Dashboard</router-link>
      <router-link to="/students" @click="closeMenu">Students</router-link>
      <router-link to="/course" @click="closeMenu">Courses</router-link>
      <hr />
      <DarkModeToggle />
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NavBar',
  setup() {
    const router = useRouter();
    const isMenuOpen = ref(false);

    const logout = () => {
      localStorage.removeItem('token');
      router.push('/auth');
    };

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const closeMenu = () => {
      isMenuOpen.value = false;
    };

    return { logout, isMenuOpen, toggleMenu, closeMenu };
  }
});
</script>

<style scoped>
/* ================= Navbar ================= */
.navbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 30px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

/* Logo */
.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-container img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 4px;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.logo-container img:hover {
  transform: scale(1.1);
}

.logo-container h1 {
  font-size: 22px;
  font-weight: 700;
  color: #007bff;
}

/* Nav Links */
.nav-links {
  display: flex;
  gap: 25px;
}

.nav-item {
  position: relative;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}
.nav-item:hover {
  color: #007bff;
}
.nav-item::after {
  content: '';
  position: absolute;
  width: 0%;
  height: 2px;
  background: #007bff;
  left: 0;
  bottom: -3px;
  transition: width 0.3s ease;
}
.nav-item:hover::after,
.router-link-active::after {
  width: 100%;
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  background: #007bff;
  color: white;
  font-weight: 600;
  border: none;
  padding: 8px 18px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}
.logout-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

/* Mobile Menu */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-toggle span,
.menu-toggle span::before,
.menu-toggle span::after {
  display: block;
  width: 25px;
  height: 3px;
  background: #007bff;
  border-radius: 2px;
  transition: all 0.3s ease;
  position: relative;
}

.menu-toggle span::before {
  content: '';
  position: absolute;
  top: -8px;
}

.menu-toggle span::after {
  content: '';
  position: absolute;
  top: 8px;
}

.menu-toggle span.open {
  background: transparent;
}
.menu-toggle span.open::before {
  transform: rotate(45deg) translate(5px, 5px);
}
.menu-toggle span.open::after {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Mobile Nav */
.mobile-nav {
  position: absolute;
  top: 70px;
  right: 30px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  animation: fadeInDown 0.3s ease;
}

.mobile-nav a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 850px) {
  .nav-links {
    display: none;
  }
  .nav-actions {
    display: none;
  }

  .menu-toggle {
    display: block;
  }
}
</style>