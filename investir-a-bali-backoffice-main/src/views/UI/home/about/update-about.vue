<template>
    <CForm>
      <CRow class="mb-3">
        <CFormLabel for="aboutPara" class="col-sm-2 col-form-label">Apropos de nous paragraphe</CFormLabel>
        <CCol sm="10">
          <CFormTextarea v-model="aboutPara" required placeholder="A propos de nous" id="about" />
        </CCol>
      </CRow>
  
  
      <!-- Field to upload a new cover image -->
      <CRow class="mb-3">
        <CFormLabel for="coverImage" class="col-sm-2 col-form-label">Ajouter une image</CFormLabel>
        <CCol sm="10">
          <CFormInput type="file" @change="handleAboutUpload" id="aboutImage" />
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
  const aboutPara = ref('')
  const aboutImage = ref('') // For the new image upload
  const existingCoverImage = ref('') // For displaying the existing cover image
  const message = ref('')
  const router = useRouter()
  const route = useRoute()

  
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
    aboutPara.value = response.data[0].about_desc
      aboutImage.value = response.data[0].about_img
      console.log("aboutPara", response.data[0].about_desc ,"aboutImage",aboutImage.value)

    } catch (error) {
      message.value =
        'Erreur lors du chargement des données: ' +
        (error.response ? error.response.data.message : error.message)
    }
  })





  
  // Handle file upload
  const handleAboutUpload = (event) => {
    const file = event.target.files[0]
    aboutImage.value = file
    console.log('File uploaded:', file)
  }
  
  // Submit the form data
  const submitForm = async () => {
    const token = localStorage.getItem('token')
    try {
      const formData = new FormData()
      formData.append('about_desc', aboutPara.value)
  
      // Append new cover image if uploaded
      if (aboutImage.value) {
        formData.append('about_img', aboutImage.value)
      }
  
      for (let [key, value] of formData.entries()) {
      console.log(key, value)
    }
      const response = await axios.put( domains + `/homes/update/${home.value._id}`, 
      {
        about_desc : aboutPara.value,
        about_img: aboutImage.value
      }
      , {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
  
      message.value = 'Section A propos de nous mise à jour avec succès!'
      localStorage.setItem('Message', 'Modification effectuée avec succées!')
      router.push('/home-page-management/a-propos')
    } catch (error) {
      message.value =
        'Erreur lors de la mise à jour: ' + (error.response ? error.response.data.message : error.message)
    }
  }
  
  // Delete the existing cover image
  const deleteCoverImage = () => {
    existingCoverImage.value = ''
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
  