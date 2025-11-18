<template>
  <header class="navbar">
    <div class="logo-container">
      <img src="@/assets/images/apprentice.png" alt="logo" />
      <h1>Student Management</h1>
    </div>

    <!-- Navigation Links -->
    <nav class="nav-links">
      <router-link to="/dashboard" class="nav-item" exact>Dashboard</router-link>
      <router-link to="/students" class="nav-item">Students</router-link>
      <router-link to="/course" class="nav-item">Courses</router-link>
    </nav>

    <div class="profile-container" @click="toggleDropdown">
      <div class="profile-info">
        <span class="username">{{ fullName }}</span>
        <div class="avatar">{{ initials }}</div>
      </div>

      <div class="dropdown" v-if="isDropdownOpen">
        <router-link to="/profile" class="dropdown-item profile">Profile</router-link>
        <hr />
        <button class="dropdown-item logout" @click="logout">Logout</button>
      </div>
    </div>

    <button class="menu-toggle" @click="toggleMenu">
      <span :class="{ open: isMenuOpen }"></span>
    </button>

    <div class="mobile-nav" v-if="isMenuOpen">
      <router-link to="/dashboard" @click="closeMenu">Dashboard</router-link>
      <router-link to="/students" @click="closeMenu">Students</router-link>
      <router-link to="/course" @click="closeMenu">Courses</router-link>
      <hr />
      <button class="dropdown-item logout" @click="logout">Logout</button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store'

export default defineComponent({
  name: 'NavBar',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const isMenuOpen = ref(false)
    const isDropdownOpen = ref(false)

    const fullName = computed(() => authStore.user?.fullName || 'Guest')
    const initials = computed(() => (fullName.value ? fullName.value.charAt(0).toUpperCase() : '?'))

    const logout = () => {
      authStore.logout()
      router.push('/auth')
    }

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
    }

    const closeMenu = () => {
      isMenuOpen.value = false
    }

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value
    }

    return {
      fullName,
      initials,
      logout,
      isMenuOpen,
      toggleMenu,
      closeMenu,
      isDropdownOpen,
      toggleDropdown,
    }
  },
})
</script>

<style scoped>
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
  position: relative;
}

/* Profile Container */
.profile-container {
  position: relative;
  cursor: pointer;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
  transition: transform 0.3s;
}
.avatar:hover {
  transform: scale(1.05);
}

.username {
  font-weight: 600;
  color: #333;
}

/* Dropdown */
.dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  width: 160px;
  animation: fadeInDown 0.2s ease;
}

.dropdown-item {
  display: block;
  text-align: left;
  padding: 10px 20px;
  width: 100%;
  border: none;
  background: none;
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;
  text-decoration: none;
  transition: 0.2s;
}

.dropdown-item.profile:hover {
  color: #007bff;
}

.dropdown-item.logout:hover {
  color: #c0392b;
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
