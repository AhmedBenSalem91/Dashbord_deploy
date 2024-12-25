<template>
  <CForm>
    <CRow class="mb-3">
      <CFormLabel for="villaName" class="col-sm-2 col-form-label">Nom de la Villa</CFormLabel>
      <CCol sm="10">
        <CFormInput v-model="villaname" id="villaName" placeholder="Nom de la villa" />
        <div v-if="errors.villaname" class="text-danger">{{ errors.villaname }}</div>
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="location" class="col-sm-2 col-form-label">Ville</CFormLabel>
      <CCol sm="10">
        <CFormInput v-model="location" id="location" placeholder="Ville" />
        <div v-if="errors.location" class="text-danger">{{ errors.location }}</div>
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
        <div v-if="errors.price" class="text-danger">{{ errors.price }}</div>
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
        <div v-if="errors.nb_bedroom" class="text-danger">{{ errors.nb_bedroom }}</div>
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
        <div v-if="errors.nb_livingroom" class="text-danger">{{ errors.nb_livingroom }}</div>
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
        <div v-if="errors.nb_bathroom" class="text-danger">{{ errors.nb_bathroom }}</div>
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
        <div v-if="errors.nb_pool" class="text-danger">{{ errors.nb_pool }}</div>
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
        <div v-if="errors.parking_capacity" class="text-danger">{{ errors.parking_capacity }}</div>
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="area" class="col-sm-2 col-form-label">Surface</CFormLabel>
      <CCol sm="10">
        <CFormInput v-model="area" required type="number" placeholder="Surface (en m²)" id="area" />
        <div v-if="errors.area" class="text-danger">{{ errors.area }}</div>
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="status" class="col-sm-2 col-form-label">Status</CFormLabel>
      <CCol sm="10">
        <CFormSelect v-model="status" id="status">
          <option disabled value="">Sélectionnez un statut</option>
          <option value="in progress">En cours</option>
          <option value="done">Terminée</option>
        </CFormSelect>
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CFormLabel for="imgAlbum" class="col-sm-2 col-form-label">Album d'images</CFormLabel>
      <CCol sm="10">
        <CFormInput type="file" :multiple="true" @change="handleFileUpload" id="imgAlbum" />
      </CCol>
    </CRow>
    <CButton color="primary" @click="submitForm">Enregistrer</CButton>
  </CForm>
  <p v-if="message">{{ message }}</p>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
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
const img_album = ref([])
const message = ref('')
const router = useRouter()

const errors = reactive({})

// Function to handle file input change
const handleFileUpload = (event) => {
  img_album.value = Array.from(event.target.files) // Convert FileList to an array
}

const validateForm = () => {
  let isValid = true

  // Ensure the fields are not empty
  errors.villaname = villaname.value.trim()
    ? ''
    : 'Le champ "Nom de la Villa" ne doit pas être vide.'
  errors.location = location.value.trim() ? '' : 'Le champ "Ville" ne doit pas être vide.'
  errors.price = price.value > 0 ? '' : 'Le champ "Prix" doit être un nombre positif.'
  errors.nb_bedroom =
    nb_bedroom.value > 0 ? '' : 'Le champ "Nombre de chambres" doit être un nombre positif.'
  errors.nb_livingroom =
    nb_livingroom.value.trim() && !isNaN(nb_livingroom.value) && nb_livingroom.value >= 0
      ? ''
      : 'Le champ "Nombre de salons" doit être un nombre valide.'
  errors.nb_bathroom =
    nb_bathroom.value > 0 ? '' : 'Le champ "Nombre de salles de bain" doit être un nombre positif.'
  errors.nb_pool =
    nb_pool.value.trim() && !isNaN(nb_pool.value) && nb_pool.value >= 0
      ? ''
      : 'Le champ "Nombre de piscines" doit être un nombre valide.'
  errors.parking_capacity =
    parking_capacity.value.trim() && !isNaN(parking_capacity.value) && parking_capacity.value >= 0
      ? ''
      : 'Le champ "Capacité de parking" doit être un nombre valide.'
  errors.area = area.value > 0 ? '' : 'Le champ "Surface" doit être un nombre positif.'

  // Set the overall validation flag
  Object.values(errors).forEach((error) => {
    if (error) isValid = false
  })

  return isValid
}

// Submit the form data
const submitForm = async () => {
  if (!validateForm()) return
  console.log('Status being submitted:', status.value)
  const token = localStorage.getItem('token')
  try {
    const formData = new FormData()
    formData.append('villaname', villaname.value)
    formData.append('location', location.value)
    formData.append('description', description.value)
    formData.append('price', price.value)
    formData.append('state', status.value)
    formData.append('nb_bedroom', nb_bedroom.value)
    formData.append('nb_livingroom', nb_livingroom.value)
    formData.append('nb_bathroom', nb_bathroom.value)
    formData.append('nb_pool', nb_pool.value)
    formData.append('parking_capacity', parking_capacity.value)
    formData.append('area', area.value)

    // Append each file to formData
    img_album.value.forEach((file) => {
      formData.append('img_album', file)
    })

    // Send POST request
    const response = await axios.post(domains + '/villas/create', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    message.value = 'Villa created successfully!'
    localStorage.setItem('Message', 'villa ajoutée avec succées!')
    router.push('/villas-management/list-villas')
  } catch (error) {
    message.value =
      'Error creating villa: ' + (error.response ? error.response.data.message : error.message)
  }
}
</script>

<style>
.text-danger {
  color: red;
  font-size: 0.875rem;
}
</style>
