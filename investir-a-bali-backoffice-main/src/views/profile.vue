<template>
  <CAlert v-if="alert" color="success" dismissible @close="() => (alert = false)">{{
    alert
  }}</CAlert>
  <CContainer>
    <CRow class="justify-content-center">
      <CCol md="8">
        <CCard>
          <CCardHeader>
            <h4>Profile</h4>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <!-- Left Column: Avatar -->
              <CCol md="4" class="text-center">
                <div class="avatar-wrapper" @click="triggerFileInput">
                  <CAvatar
                    :src="avatarPreview ||  domains + `/uploads/users/${profile.avatar}`"
                    class="mb-3 avatar-click"
                  />
                  <!-- Upload icon -->
                  <div class="upload-icon">
                    <CIcon icon="cil-arrow-bottom" size="lg" />
                    <!-- Use an icon like CoreUI's upload icon -->
                  </div>
                </div>
                <input type="file" ref="fileInput" class="d-none" @change="onFileChange" />
              </CCol>

              <!-- Right Column: Form -->
              <CCol md="8">
                <CForm @submit.prevent="handleSubmit">
                  <!-- First Name -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Prénom</CInputGroupText>
                    <CFormInput v-model="profile.firstName" placeholder="Enter First Name" />
                  </CInputGroup>

                  <!-- Last Name -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Nom</CInputGroupText>
                    <CFormInput v-model="profile.lastName" placeholder="Enter Last Name" />
                  </CInputGroup>

                  <!-- Email -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Email</CInputGroupText>
                    <CFormInput type="email" v-model="profile.email" placeholder="Enter Email" />
                  </CInputGroup>

                  <!-- Phone Number -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Numéro télephone</CInputGroupText>
                    <CFormInput v-model="profile.phoneNumber" placeholder="Enter Phone Number" />
                  </CInputGroup>

                  <!-- Submit Button -->
                  <CButton type="submit" color="primary">Enregitrer</CButton>
                  <CButton style="margin-left: 1rem;" @click="redirctToDashboard" color="primary">annuler</CButton>

                </CForm>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { domains } from '../environement'

const user = ref()
const router = useRouter()

// Profile data, with avatar as part of the profile
const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  avatar: '', // Avatar will be updated based on file upload
})

// File input reference
const fileInput = ref(null)
const selectedFile = ref(null) // Hold the selected avatar file
const avatarPreview = ref('') // Preview the avatar before upload
const alert = ref('')

// Fetch profile from the server
const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('token') // Retrieve the token from local storage
    const response = await fetch( domains + '/users/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      user.value = data
      profile.value = data.profile // Populate profile data from the response
    } else {
      console.error('Error fetching profile:', response.status)
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
}

const setAlert = (message) => {
  // Save the alert message to localStorage before reloading
  localStorage.setItem('alertMessage', message);
  location.reload(); // Reload the page after setting the alert
}

const redirctToDashboard = ()=> {
  router.push('/dashboard')
}


// Handle form submission
// Handle form submission
const handleSubmit = async () => {
  const token = localStorage.getItem('token')
  try {
    if (!token) {
      throw new Error('No token found, please log in.')
    }

    // Create FormData object to handle file upload
    const formData = new FormData()
    formData.append('firstName', profile.value.firstName)
    formData.append('lastName', profile.value.lastName)
    formData.append('email', profile.value.email)
    formData.append('phoneNumber', profile.value.phoneNumber)

    // Append the selected file (avatar) if it exists
    if (selectedFile.value) {
      formData.append('avatar', selectedFile.value)
    }

    // Send the PUT request with FormData
    const response = await axios.put(
       domains + `/users/update/${user.value._id}`,
      formData, // Sending FormData directly
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Ensure multipart
        },
      },
    )
    setAlert('Profile modifé avec succées !')

  } catch (error) {
    console.error('Error updating profile:', error.response ? error.response.data : error.message)
  }
}

// Trigger the file input click event
const triggerFileInput = () => {
  fileInput.value.click()
}

// Handle file change (for avatar upload)
const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file // Save the selected file

    // Create a preview for the user
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result // Preview the uploaded image
    }
    reader.readAsDataURL(file)
  }
}

onMounted(() => {
  fetchProfile()

  // Check if there's an alert message stored in localStorage
  const alertMessage = localStorage.getItem('alertMessage');
  if (alertMessage) {
    // Display the alert message
    alert.value = alertMessage;
    // Clear the alert after 4 seconds
    setTimeout(() => {
      alert.value = '';
      localStorage.removeItem('alertMessage'); // Remove it from localStorage
    }, 2000);
  }
})

</script>

<style scoped>
/* Make the avatar look clickable */
.avatar-click {
  cursor: pointer;
  width: 150px;
  height: 150px;
}
.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar-click {
  transition: 0.3s ease-in-out; /* Smooth transition */
}

.avatar-wrapper:hover .avatar-click {
  filter: brightness(50%); /* Darken the image */
}

.upload-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0; /* Initially hidden */
  font-size: 2rem;
  color: white;
  transition: 0.3s ease-in-out;
}

.avatar-wrapper:hover .upload-icon {
  opacity: 1; /* Show the icon on hover */
}
</style>
