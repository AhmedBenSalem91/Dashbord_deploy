<template>
    <CForm>
      <CRow class="mb-3">
        <CFormLabel for="coverTitle" class="col-sm-2 col-form-label">Titre</CFormLabel>
        <CCol sm="10">
          <CFormInput v-model="title" required placeholder="Titre de la couverture" id="coverTitle" />
        </CCol>
      </CRow>
  
  
      <!-- Field to upload a new cover image -->
      <CRow class="mb-3">
        <CFormLabel for="coverImage" class="col-sm-2 col-form-label">Ajouter une image</CFormLabel>
        <CCol sm="10">
          <CFormInput type="file" @change="handleCoverUpload" id="coverImage" />
        </CCol>
      </CRow>
  
      <CButton color="primary" @click="submitForm">Confirmer</CButton>
    </CForm>
  
    <p v-if="message">{{ message }}</p>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter, useRoute } from 'vue-router'
  import { domains } from '@/environement'

  const home  = ref(null)
  const title = ref('')
  const coverImage = ref('') // For the new image upload
  const existingCoverImage = ref('') // For displaying the existing cover image
  const message = ref('')
  const router = useRouter()
  const route = useRoute()
  
  // Retrieve the villa ID from the route parameters
  const villaId = route.params.id
  
  // Fetch the cover details when the component is mounted
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
      title.value = response.data[0].title
      coverImage.value = response.data[0].hero
      console.log("title", response.data[0].title ,"heroo",coverImage.value)

    } catch (error) {
      message.value =
        'Erreur lors du chargement des données: ' +
        (error.response ? error.response.data.message : error.message)
    }
  })





  
  // Handle file upload
  const handleCoverUpload = (event) => {
    const file = event.target.files[0]
    coverImage.value = file
    console.log('File uploaded:', file)
  }
  
  // Submit the form data
  const submitForm = async () => {
    const token = localStorage.getItem('token')
    try {
      const formData = new FormData()
      formData.append('title', title.value)
  
      // Append new cover image if uploaded
      if (coverImage.value) {
        formData.append('hero', coverImage.value)
      }
  
      for (let [key, value] of formData.entries()) {
      console.log(key, value)
    }
      const response = await axios.put( domains + `/homes/update/${home.value._id}`, 
      {
        title : title.value,
        hero: coverImage.value
      }
      , {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
  
      message.value = 'Couverture mise à jour avec succès!'
      localStorage.setItem('Message', 'modification effectuée avec succées!')

      router.push('/home-page-management/cover')
    } catch (error) {
      message.value =
        'Erreur lors de la mise à jour: ' + (error.response ? error.response.data.message : error.message)
    }
  }
  
  // Delete the existing cover image
  const deleteCoverImage = () => {
    existingCoverImage.value = '' // Remove the cover image visually
    // You might want to send an API request to delete it from the server
  }
  </script>
  
  <style scoped>
  .img-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
  
  .img-container img {
    max-width: 200px;
    object-fit: cover;
  }
  </style>
  