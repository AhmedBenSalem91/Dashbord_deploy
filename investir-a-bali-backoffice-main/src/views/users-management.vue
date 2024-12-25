<template>
  <CAlert
    v-if="alert"
    color="success"
    dismissible
    @close="
      () => {
        alert = false
      }
    "
    >{{ alert }}</CAlert
  >
  <p v-if="message">{{ message }}</p>
  <CTable v-else caption="top" striped>
    <CTableCaption>
      Liste des Utilisateurs
      <CButton color="primary" size="sm" class="add-user-btn" @click="redirectToAddUser"
        >Ajouter Utilisateurs</CButton
      >
    </CTableCaption>
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell scope="col"></CTableHeaderCell>
        <CTableHeaderCell scope="col">Username</CTableHeaderCell>
        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
        <CTableHeaderCell scope="col">Role</CTableHeaderCell>
        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      <UserItem
        v-for="(user, index) in users"
        :key="user._id"
        :index="index"
        :user="user"
        :refreshUsers="refreshUsers"
        :setAlert="setAlert"
      />
    </CTableBody>
  </CTable>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import UserItem from './UI/users/User-item.vue'
import { domains } from '../environement'

const alert = ref('')
const router = useRouter()

// Define the users array
const users = ref([])
const message = ref('')

const redirectToAddUser = () => {
  router.push('/users-management/add-user')
}

// Fetch users when the component is mounted
onMounted(async () => {
  //alert showing when adding a new user:
  const storedMessage = localStorage.getItem('userMessage')
  if (storedMessage) {
    alert.value = storedMessage
    localStorage.removeItem('userMessage')
    setTimeout(() => {
      alert.value = ''
    }, 3000)
  }
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('No token found, please log in.')
    }

    // Send the token in the Authorization header
    const response = await axios.get( domains + '/users', {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request header
      },
    })

    users.value = response.data
    console.log('the list of users iiiiis:::: ', users.value[0]._id)
  } catch (error) {
    message.value = 'Error fetching users. Please try again later.'
    console.error('Error fetching users:', error)
  }
})
const refreshUsers = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get( domains + '/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    users.value = response.data
  } catch (error) {
    console.error('Error refreshing users:', error)
  }
}

// Function to set the alert message
const setAlert = (message) => {
  alert.value = message
  setTimeout(() => {
    alert.value = '' // Clear the alert after 3 seconds
  }, 3000)
}
</script>

<style scoped>
.add-user-btn {
  margin-left: 50px;
}
</style>
