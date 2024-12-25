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
      Liste des Villas
      <CButton color="primary" size="sm" class="add-villa-btn" @click="redirectToAddVilla"
        >Ajouter Villa</CButton
      >
    </CTableCaption>
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell scope="col"></CTableHeaderCell>
        <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
        <CTableHeaderCell scope="col">Ville</CTableHeaderCell>
        <!-- <CTableHeaderCell scope="col">Description</CTableHeaderCell> -->
        <CTableHeaderCell scope="col">Prix $</CTableHeaderCell>
        <CTableHeaderCell scope="col">Nombre de Chambres</CTableHeaderCell>
        <!-- <CTableHeaderCell scope="col">nombre Salons</CTableHeaderCell>
        <CTableHeaderCell scope="col">nombre Sallesdebain</CTableHeaderCell>
        <CTableHeaderCell scope="col">nombre Piscines</CTableHeaderCell>
        <CTableHeaderCell scope="col">capacité Parking</CTableHeaderCell> -->
        <CTableHeaderCell scope="col">Surface M²</CTableHeaderCell>
        <!-- <CTableHeaderCell scope="col">Album d'images</CTableHeaderCell> -->
        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      <VillaItem
        v-for="(villa, index) in villas"
        :key="villa._id"
        :index="index"
        :villa="villa"
        :refreshVillas="refreshVillas"
        :setAlert="setAlert"
      />
    </CTableBody>
  </CTable>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import VillaItem from './UI/villas/Villa-item.vue'
import { domains } from '../environement'

const alert = ref('')
const router = useRouter()
const villas = ref([])
const message = ref('')

const redirectToAddVilla = () => {
  router.push('/villas-management/add-villa')
}

// Fetch villas when the component is mounted
onMounted(async () => {
  const storedMessage = localStorage.getItem('Message')
  if (storedMessage) {
    alert.value = storedMessage
    localStorage.removeItem('Message')
    setTimeout(() => {
      alert.value = ''
    }, 3000)
  }
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('No token found, please log in.')
    }

    const response = await axios.get( domains + '/villas', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    villas.value = response.data
  } catch (error) {
    message.value = 'Error fetching villas. Please try again later.'
    console.error('Error fetching villas:', error)
  }
})

const refreshVillas = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get( domains + '/villas', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    villas.value = response.data
  } catch (error) {
    console.error('Error refreshing villas:', error)
  }
}

const setAlert = (message) => {
  alert.value = message
  setTimeout(() => {
    alert.value = '' // Clear the alert after 3 seconds
  }, 3000)
}
</script>

<style scoped>
.add-villa-btn {
  margin-left: 50px;
}
</style>
