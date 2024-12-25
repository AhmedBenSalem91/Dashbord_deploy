<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar v-if="usersStore.user" :src="domains + `/uploads/users/${usersStore.user.profile.avatar}`" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownItem @click="redirectToProfile">
        <CIcon icon="cil-user" /> Profile
      </CDropdownItem>
      <CDropdownItem @click="logout">
        <CIcon icon="cil-lock-locked" /> Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/usersStore';
import { domains } from '../environement'

const router = useRouter()
const user = ref()
// Use the users store
const usersStore = useUsersStore();

const itemsCount = 42

const redirectToProfile = () => {
  router.push('/profile')
}

// Logout method
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  router.push('pages/login')

}

onMounted(() => {
  usersStore.fetchUserProfile();
})
</script>
