<template>
    <CForm>
      <CRow class="mb-3">
        <CFormLabel for="inputEmail3" class="col-sm-2 col-form-label">Nom d'utilisateur</CFormLabel>
        <CCol sm="10">
          <CFormInput v-model="username" required placeholder="User name" id="username" />
        </CCol>
      </CRow>
      <CRow class="mb-3">
        <CFormLabel for="inputPassword3" class="col-sm-2 col-form-label">Mot de passe</CFormLabel>
        <CCol sm="10">
          <CFormInput
            v-model="password"
            required
            placeholder="Password"
            type="password"
            id="password"
          />
        </CCol>
      </CRow>
      <fieldset class="row mb-3">
        <legend class="col-form-label col-sm-2 pt-0">Role</legend>
        <CCol sm="10">
          <CFormCheck
            v-model="role"
            type="radio"
            name="role"
            id="adminRole"
            value="admin"
            label="Administrateur"
            checked
          />
          <CFormCheck
            v-model="role"
            type="radio"
            name="role"
            id="clientRole"
            value="client"
            label="Client"
          />
        </CCol>
      </fieldset>
      <CButton color="primary" variant="outline" @click="submitForm">Confirmer</CButton>
    </CForm>
    <p v-if="message">{{ message }}</p>
  </template>
  
  <script setup>
  import { ref, onMounted  } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { useRoute } from 'vue-router'
  import { domains } from '@/environement'
  
  const username = ref('')
  const password = ref('')
  const role = ref('client')
  const message = ref('')
  const router = useRouter()

  const route = useRoute()
const userId = route.params.id

onMounted(async () => {
  try {
    const response = await axios.get( domains + `/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    const user = response.data
    username.value = user.username
    password.value = '' // For security, don't pre-fill the password
    role.value = user.role
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
})
  
  // Submit the form data
  const submitForm = async () => {
  console.log('Submitting form...')
  const token = localStorage.getItem('token')
  try {
    if (!token) {
      throw new Error('No token found, please log in.')
    }

    // Create the user object
    const updatedUser = {
      username: username.value,
      password: password.value,
      role: role.value,
    }

    // Send the PUT request to update the user
    const response = await axios.put( domains + `/users/update/${userId}`, updatedUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Handle success
    message.value = 'User updated successfully!'
    localStorage.setItem('userMessage', 'Utilisateur modifié!')
    router.push('/users-management/list-users')

  } catch (error) {
    console.error('Error updating user:', error.response ? error.response.data : error.message)
    message.value =
      'Error updating user: ' + (error.response ? error.response.data.message : error.message)
  }
}

  </script>
  