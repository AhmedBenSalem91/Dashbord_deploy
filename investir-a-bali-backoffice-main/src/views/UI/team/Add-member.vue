<template>
    <CForm>
      <CRow class="mb-3">
        <CFormLabel for="firstName" class="col-sm-2 col-form-label">Prénom</CFormLabel>
        <CCol sm="10">
          <CFormInput v-model="firstName" required placeholder="Prénom" id="firstName" />
        </CCol>
      </CRow>
      <CRow class="mb-3">
        <CFormLabel for="role" class="col-sm-2 col-form-label">Role</CFormLabel>
        <CCol sm="10">
          <CFormInput v-model="role" required placeholder="Role" id="role" />
        </CCol>
      </CRow>
      <CRow class="mb-3">
        <CFormLabel for="email" class="col-sm-2 col-form-label">Email</CFormLabel>
        <CCol sm="10">
          <CFormInput v-model="email" required type="email" placeholder="Email" id="email" />
        </CCol>
      </CRow>
      <CRow class="mb-3">
      <CFormLabel for="avatar" class="col-sm-2 col-form-label">Avatar</CFormLabel>
      <CCol sm="10">
        <CFormInput type="file" @change="handleFileUpload" id="avatar" />
      </CCol>
    </CRow>

    <!-- Avatar Preview -->
    <CRow v-if="avatarPreview" class="mb-3">
      <CCol sm="10" class="offset-sm-2">
        <img :src="avatarPreview" alt="Avatar Preview" class="avatar-preview" />
      </CCol>
    </CRow>
      <CButton color="primary" @click="submitForm">Enregistrer</CButton>
    </CForm>
    <p v-if="message">{{ message }}</p>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { domains } from '@/environement'
  
  const firstName = ref('')
  const role = ref('')
  const email = ref('')
  const avatar = ref(null) 
  const avatarPreview = ref(null) // For avatar image preview
  const message = ref('')
  const router = useRouter()
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    avatar.value = file
    
    if (file) {
      avatarPreview.value = URL.createObjectURL(file) // Create a preview URL for the avatar
    }
  }
  
  const submitForm = async () => {
    const token = localStorage.getItem('token')
    try {
      const formData = new FormData()
      formData.append('name', firstName.value)
      formData.append('memberRole', role.value)
      formData.append('email', email.value)
  
      if (avatar.value) {
        formData.append('avatar', avatar.value)
      }
  
      // Send POST request
      const response = await axios.post( domains + '/team-members/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
  
      message.value = 'Member created successfully!'
      localStorage.setItem('Message', 'Membre ajouté avec succès!')
      router.push('/team-management/members-list')
  
    } catch (error) {
      message.value = 'Error creating member: ' + (error.response ? error.response.data.message : error.message)
    }
  }
  </script>
  
  <style scoped>
  .avatar-preview {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
  }
  </style>
  