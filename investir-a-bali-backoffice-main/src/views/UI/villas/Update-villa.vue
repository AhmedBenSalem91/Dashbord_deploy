<template>
  <CForm>
    <CRow class="mb-3">
      <CFormLabel for="villaName" class="col-sm-2 col-form-label">Nom de la Villa</CFormLabel>
      <CCol sm="10">
        <CFormInput v-model="villaname" required placeholder="Nom de la villa" id="villaName" />
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="location" class="col-sm-2 col-form-label">Ville</CFormLabel>
      <CCol sm="10">
        <CFormInput v-model="location" required placeholder="Ville" id="location" />
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="description" class="col-sm-2 col-form-label">Description</CFormLabel>
      <CCol sm="10">
        <CFormTextarea v-model="description" required placeholder="Description" id="description" />
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="price" class="col-sm-2 col-form-label">Prix</CFormLabel>
      <CCol sm="10">
        <CFormInput v-model="price" required type="number" placeholder="Prix (en $)" id="price" />
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="bedroomCount" class="col-sm-2 col-form-label">Nombre de chambres</CFormLabel>
      <CCol sm="10">
        <CFormInput
          v-model="nb_bedroom"
          required
          type="number"
          placeholder="Chambres"
          id="bedroomCount"
        />
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="livingRoomCount" class="col-sm-2 col-form-label"
        >Nombre de salons</CFormLabel
      >
      <CCol sm="10">
        <CFormInput
          v-model="nb_livingroom"
          required
          type="number"
          placeholder="Salons"
          id="livingRoomCount"
        />
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="bathroomCount" class="col-sm-2 col-form-label"
        >Nombre de salles de bain</CFormLabel
      >
      <CCol sm="10">
        <CFormInput
          v-model="nb_bathroom"
          required
          type="number"
          placeholder="Salles de bain"
          id="bathroomCount"
        />
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="poolCount" class="col-sm-2 col-form-label">Nombre de piscines</CFormLabel>
      <CCol sm="10">
        <CFormInput
          v-model="nb_pool"
          required
          type="number"
          placeholder="Piscines"
          id="poolCount"
        />
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="parkingCapacity" class="col-sm-2 col-form-label"
        >Capacité de parking</CFormLabel
      >
      <CCol sm="10">
        <CFormInput
          v-model="parking_capacity"
          required
          type="number"
          placeholder="Capacité de parking"
          id="parkingCapacity"
        />
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="area" class="col-sm-2 col-form-label">Surface</CFormLabel>
      <CCol sm="10">
        <CFormInput v-model="area" required type="number" placeholder="Surface (en m²)" id="area" />
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="status" class="col-sm-2 col-form-label">Status</CFormLabel>
      <CCol sm="10">
        <CFormSelect v-model="status" id="status" required>
          <option disabled value="">Sélectionnez un statut</option>
          <option value="in progress">En cours</option>
          <option value="done">Terminée</option>
        </CFormSelect>
      </CCol>
    </CRow>

    <div v-if="existingImages.length">
  <h5>Album de photos Villa</h5>
  <div class="img-flex">
    <div v-for="(image, index) in existingImages" :key="index" class="img-container">
      <button class="delete-btn" @click="deleteImage(image)">×</button>
      <img :src="domains + `/uploads/villas/${image}`" alt="Villa Image" />
    </div>
  </div>
</div>
    <div v-else class="img-flex">
      <h5>Album de photos Villa</h5>
      <p>album vide!</p>
    </div>

    <CRow class="mb-3">
      <CFormLabel for="imgAlbum" class="col-sm-2 col-form-label">Ajouter images</CFormLabel>
      <CCol sm="10">
        <CFormInput type="file" :multiple="true" @change="handleFileUpload" id="imgAlbum" />
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

const villaname = ref('')
const location = ref('')
const description = ref('')
const price = ref('')
const nb_bedroom = ref('')
const nb_livingroom = ref('')
const nb_bathroom = ref('')
const nb_pool = ref('')
const parking_capacity = ref('')
const area = ref('')
const status = ref('')
const img_album = ref([]) // Initialize img_album as an empty array
const message = ref('')
const router = useRouter()
const route = useRoute()
const existingImages = ref([])

// Retrieve the villa ID from the route parameters
const villaId = route.params.id

// Fetch the villa details when the component is mounted
onMounted(async () => {
  try {
    const response = await axios.get(domains + `/villas/${villaId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    const villa = response.data
    existingImages.value = villa.img_album
    villaname.value = villa.villaname
    location.value = villa.location
    description.value = villa.description
    price.value = villa.price
    nb_bedroom.value = villa.nb_bedroom
    nb_livingroom.value = villa.nb_livingroom
    nb_bathroom.value = villa.nb_bathroom
    nb_pool.value = villa.nb_pool
    parking_capacity.value = villa.parking_capacity
    area.value = villa.area
    status.value = villa.state
  } catch (error) {
    message.value =
      'Error loading villa data: ' + (error.response ? error.response.data.message : error.message)
  }
})

const deleteImage = (name) => {
  existingImages.value = existingImages.value.filter((img) => img != name)
  console.log('exesting images after deletion', existingImages.value)
}

// Handle file upload
const handleFileUpload = (event) => {
  const files = event.target.files
  img_album.value = Array.from(files)
}

// Submit the form data
const submitForm = async () => {
  const token = localStorage.getItem('token')
  try {
    const formData = new FormData()

    formData.append('villaname', villaname.value)
    formData.append('location', location.value)
    formData.append('description', description.value)
    formData.append('price', price.value)
    formData.append('nb_bedroom', nb_bedroom.value)
    formData.append('nb_livingroom', nb_livingroom.value)
    formData.append('nb_bathroom', nb_bathroom.value)
    formData.append('nb_pool', nb_pool.value)
    formData.append('parking_capacity', parking_capacity.value)
    formData.append('area', area.value)
    formData.append('state', status.value)

    // Append existing images
    existingImages.value.forEach((image) => {
      formData.append('existing_images', image)
    })

    // Append new images
    img_album.value.forEach((file) => {
      formData.append('img_album', file)
    })
    img_album.value = [...existingImages.value, ...img_album.value]

    console.log('existing images', existingImages.value)
    console.log('img album', img_album.value)
    console.log('form data after append', formData)

    const response = await axios.put(domains + `/villas/update/${villaId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    message.value = 'Villa updated successfully!'
    localStorage.setItem('Message', 'villa modifiée avec succées!')
    router.push('/villas-management/list-villas')
  } catch (error) {
    message.value =
      'Error updating villa: ' + (error.response ? error.response.data.message : error.message)
  }
}
</script>

<style scoped>
.img-flex {
  display: flex;
  gap: 20px; /* Adds space between images */
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.img-flex img {
  max-width: 155px; /* Limits the image width */
  height: 100%; /* Keeps the aspect ratio */
  object-fit: cover; /* Ensures the images fill the box without distortion */
}
.img-container {
  position: relative;
  display: inline-block;
}

.img-container img {
  display: block;
  width: 150px; /* Adjust width as needed */
  height: auto;
  border-radius: 8px; /* Optional: for rounded corners */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: for a subtle shadow */
}

.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: transparent; /* Red background with some transparency */
  color: black;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
  padding: 0;
  outline: none;
}

.delete-btn:hover {
  background-color: white; /* Fully opaque red on hover */
}
</style>
