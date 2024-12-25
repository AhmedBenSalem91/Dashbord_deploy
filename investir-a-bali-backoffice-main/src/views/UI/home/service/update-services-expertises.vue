<template>
    <CForm>
      <!-- Services Section -->
      <h5>Services</h5>
      <CRow class="mb-3">
        <CFormLabel for="servicesField" class="col-sm-2 col-form-label">Services</CFormLabel>
        <CCol sm="10">
          <CFormTextarea v-model="services" required placeholder="Description des services" id="servicesField" rows="4" />
        </CCol>
      </CRow>
  
      <!-- Expertises Section -->
      <h5>Expertises</h5>
      <div v-for="(expertise, index) in expertises" :key="index" class="mb-3">
        <CRow class="mb-3">
          <CFormLabel class="col-sm-2 col-form-label">Expertise {{ index + 1 }}</CFormLabel>
          <CCol sm="10">
            <CFormInput v-model="expertise.name" placeholder="Nom de l'expertise" class="mb-2" />
            <CFormTextarea v-model="expertise.description" placeholder="Description de l'expertise" rows="3" />
          </CCol>
        </CRow>
      </div>
  
      <!-- Submit Button -->
      <CButton color="primary" class="mt-4" @click="submitForm">Confirmer</CButton>
    </CForm>
  
    <p v-if="message">{{ message }}</p>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { domains } from '@/environement'
  
  const services = ref('')
  const expertises = ref([]) // Array for holding expertises
  const message = ref('')
  const router = useRouter()
  const home = ref(null)
  
  // Fetch existing services and expertises when the component is mounted
  onMounted(async () => {
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
  
      home.value = response.data[0]
      services.value = response.data[0].services
      expertises.value = response.data[0].expertises
    } catch (error) {
      message.value = 'Erreur lors du chargement des données: ' + (error.response ? error.response.data.message : error.message)
    }
  })
  
  // Submit the form data
  const submitForm = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.put( domains + `/homes/update/${home.value._id}`, 
        {
          services: services.value,
          expertises: expertises.value
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      message.value = 'Services et expertises mis à jour avec succès!'
      localStorage.setItem('Message', 'modification effectuée avec succées!')

      router.push('/home-page-management/services-et-expertises')
    } catch (error) {
      message.value = 'Erreur lors de la mise à jour: ' + (error.response ? error.response.data.message : error.message)
    }
  }
  </script>
  
  <style scoped>
    .mb-3 {
      margin-bottom: 1rem;
    }
  
    .mt-4 {
      margin-top: 1rem;
    }
  
    h5 {
      margin-bottom: 1rem;
    }
  </style>
  