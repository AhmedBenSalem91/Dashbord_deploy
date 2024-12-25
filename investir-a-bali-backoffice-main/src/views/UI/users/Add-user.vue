<template>
  <CForm>
    <CRow class="mb-3">
      <CFormLabel for="username" class="col-sm-2 col-form-label">Nom d'utilisateur</CFormLabel>
      <CCol sm="10">
        <CFormInput v-model="form.username" id="username" placeholder="User name" />
        <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="email" class="col-sm-2 col-form-label">Email</CFormLabel>
      <CCol sm="10">
        <CFormInput v-model="form.email" id="email" type="email" placeholder="Email" />
        <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
      </CCol>
    </CRow>
    <fieldset class="row mb-3">
      <legend class="col-form-label col-sm-2 pt-0">Role</legend>
      <CCol sm="10">
        <CFormCheck
          v-model="form.role"
          type="radio"
          name="role"
          id="adminRole"
          value="admin"
          label="Administrateur"
        />
        <CFormCheck
          v-model="form.role"
          type="radio"
          name="role"
          id="clientRole"
          value="client"
          label="Client"
        />
      </CCol>
    </fieldset>
    <CButton color="primary" @click="submitForm">Enregistrer</CButton>
  </CForm>

  <!-- Popup Modal -->
  <div v-if="showErrorPopup" class="popup-overlay" @click.self="closePopup">
    <div class="popup-content">
      <button class="close-button" @click="closePopup">×</button>
      <p>{{ popupMessage }}</p>
    </div>
  </div>
</template>





<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { domains } from '@/environement'

const form = reactive({
  username: '',
  email: '',
  role: 'client', // Default value
})

const errors = reactive({
  username: '',
  email: '',
})

const message = ref('')
const showErrorPopup = ref(false) // Controls popup visibility
const popupMessage = ref('') // Message to display in the popup
const router = useRouter()

const validateForm = () => {
  let isValid = true

  errors.username = ''
  errors.email = ''

  // Validate username
  if (!form.username.trim()) {
    errors.username = 'Le champ "Nom d\'utilisateur" ne doit pas être vide.'
    isValid = false
  }

  // Validate email
  if (!form.email.trim()) {
    errors.email = 'Le champ "Email" ne doit pas être vide.'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Veuillez entrer une adresse email valide.'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  const token = localStorage.getItem('token')

  if (!token) {
    message.value = 'No token found, please log in.'
    router.push('/login')
    return
  }

  try {
    const response = await axios.post(`${domains}/users/create`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    message.value = 'User created successfully!'
    form.username = ''
    form.email = ''
    form.role = 'client'
    router.push('/users-management/list-users')
  } catch (error) {
    // Check if the error is username or email exists
    if (error.response && error.response.data && error.response.data.message) {
      popupMessage.value = error.response.data.message // Set popup message
      showErrorPopup.value = true // Show the popup
    } else {
      message.value = 'An error occurred. Please try again.'
    }
  }
}

// Function to close the popup
const closePopup = () => {
  showErrorPopup.value = false
}
</script>




<style>
.text-danger {
  color: red;
  font-size: 0.875rem;
}
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 90%;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover {
  color: red;
}

</style>
