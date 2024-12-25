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
      La section "A propos de nous"
      <CButton color="primary" size="sm" class="add-home-btn" @click="redirectToUpdateAbout">
        Modifier
      </CButton>
    </CTableCaption>
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell scope="col">Image</CTableHeaderCell>
        <CTableHeaderCell scope="col">A propos de nous paragraphge</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody v-if="home">
      <CTableRow>
        
        <CTableDataCell>
          <img style="height: auto; width: 100%;" :src=" domains + `/uploads/home/${home.about_img}`" alt="img-a-propos" />
        </CTableDataCell>
        <CTableDataCell style="width: 50%;">{{ home.about_desc }}</CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { domains } from '@/environement'

const alert = ref('')
const router = useRouter()
const home = ref(null) // Initialize with null to avoid accessing undefined properties
const message = ref('')

// Redirect function
const redirectToUpdateAbout = () => {
  router.push('/home-page-management/update-about')
}

// Fetch home entry when the component is mounted
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

    const response = await axios.get( domains + '/homes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Assuming there's only one home entry
    if (response.data.length > 0) {
      home.value = response.data[0]
    } else {
      message.value = 'No home entry found.'
    }
  } catch (error) {
    message.value = 'Error fetching home entry. Please try again later.'
    console.error('Error fetching home:', error)
  }
})
</script>

<style scoped>
.add-home-btn {
  margin-left: 50px;
}
</style>
