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
  
      <CButton color="primary" @click="submitForm">Mettre à jour</CButton>
    </CForm>
    <p v-if="message">{{ message }}</p>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter, useRoute } from 'vue-router'
  import { domains } from '@/environement'
  
  const firstName = ref('')
  const role = ref('')
  const email = ref('')
  const avatar = ref(null)
  const avatarPreview = ref(null)
  const message = ref('')
  const router = useRouter()
  const route = useRoute() // For getting member ID from URL
  
  const memberId = route.params.id
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    avatar.value = file
  
    if (file) {
      avatarPreview.value = URL.createObjectURL(file)
    }
  }
  
  const loadMemberData = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get( domains + `/team-members/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      const member = response.data
      firstName.value = member.name
      role.value = member.memberRole
      email.value = member.email
  
    } catch (error) {
      message.value = 'Error loading member data: ' + (error.response ? error.response.data.message : error.message)
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
  
      // Send PUT request to update the member
      await axios.put( domains + `/team-members/update/${memberId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
  
      message.value = 'Member updated successfully!'
      localStorage.setItem('Message', 'membre modifiée avec succées!')
      router.push('/team-management/members-list')
  
    } catch (error) {
      message.value = 'Error updating member: ' + (error.response ? error.response.data.message : error.message)
    }
  }
  
  onMounted(() => {
    loadMemberData()
  })
  </script>
  
  <style scoped>
  .avatar-preview {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
  }
  </style>
  