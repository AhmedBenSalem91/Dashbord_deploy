<template>
  <CAlert
    v-if="alert"
    color="success"
    dismissible
    @close="
      () => {
        alert = false
      }
    "
  >
    {{ alert }}
  </CAlert>
  <p v-if="message">{{ message }}</p>
  <CTable v-else caption="top" striped style="margin-bottom: 10rem">
    <CTableCaption> Services </CTableCaption>
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell scope="col">Services</CTableHeaderCell>
        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody v-if="home">
      <!-- Display Services -->
      <CTableRow>
        <CTableDataCell>{{ home.services }}</CTableDataCell>
        <CTableDataCell style="padding-right: 5rem;">
          <CButton
            color="primary"
            variant="outline"
            size="sm"
            @click="openModalService"
          >
            Modifier
          </CButton>
        </CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>

  <!-- expertise -->
  <CTable caption="top" striped>
    <CTableCaption> Expertises </CTableCaption>
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell scope="col"></CTableHeaderCell>
        <CTableHeaderCell scope="col">Expertise</CTableHeaderCell>
        <CTableHeaderCell scope="col">Description</CTableHeaderCell>

        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody v-if="home">
      <ExpertiseItem
        v-for="(expertise, index) in expertises"
        :key="expertise._id"
        :index="index"
        :expertise="expertise"
        :refreshExpertises="refreshExpertises"
        :setAlert="setAlert"
        @openUpdateModal="handleOpenUpdateModal"
      />

      <!-- button to add expertise -->
      <CTableRow>
        <CTableHeaderCell scope="row"></CTableHeaderCell>
        <CTableDataCell></CTableDataCell>
        <CTableDataCell></CTableDataCell>
        <CTableDataCell style="display: flex; justify-content: center; align-items: center">
          <CButton
            style="margin-top: 1rem"
            color="primary"
            size="sm"
            @click="
              () => {
                visibleScrollableDemo = true
              }
            "
            >Ajouter expertise</CButton
          >
        </CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>


  <!-- update service modal -->
  <CModal
    size="xl"
    alignment="center"
    scrollable
    :visible="visibleModalService"
    @close="() => (visibleModalService = false)"
    aria-labelledby="ScrollingLongContentExampleLabel2"
  >
    <CModalHeader>
      <CModalTitle id="ScrollingLongContentExampleLabel2">Modifier service</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm>
        <CRow class="mb-3">
          <CFormLabel for="inputName" class="col-sm-2 col-form-label">services</CFormLabel>
          <CCol sm="10">
            <CFormTextarea
              v-model="services"
              placeholder="services"
              rows="3"
            />
          </CCol>
        </CRow>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="primary" @click="updateService">Confirmer</CButton>
    </CModalFooter>
  </CModal>

  <!-- modal d'ajout d'expertise -->
  <CModal
  size="xl"
    alignment="center"
    scrollable
    :visible="visibleScrollableDemo"
    @close="
      () => {
        visibleScrollableDemo = false
      }
    "
    aria-labelledby="ScrollingLongContentExampleLabel2"
  >
    <CModalHeader>
      <CModalTitle id="ScrollingLongContentExampleLabel2">Ajouter expertise</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm>
        <CRow class="mb-3">
          <CFormLabel for="inputName" class="col-sm-2 col-form-label"
            >Nom d'expertise</CFormLabel
          >
          <CCol sm="10">
            <CFormInput v-model="name" required placeholder="Nom d'expertise" id="name" />
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CFormLabel for="inputDescription" class="col-sm-2 col-form-label">Description</CFormLabel>
          <CCol sm="10">
            <CFormTextarea v-model="description" placeholder="Description de l'expertise" rows="3" />
          </CCol>
        </CRow>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="primary" @click="submitForm">Enregistrer</CButton>
    </CModalFooter>
  </CModal>

  <!-- update expertise modal -->
  <CModal
    size="xl"
    alignment="center"
    scrollable
    :visible="visibleModal"
    @close="() => (visibleModal = false)"
    aria-labelledby="ScrollingLongContentExampleLabel2"
  >
    <CModalHeader>
      <CModalTitle id="ScrollingLongContentExampleLabel2">Modifier expertise</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm>
        <CRow class="mb-3">
          <CFormLabel for="inputName" class="col-sm-2 col-form-label">Nom d'expertise</CFormLabel>
          <CCol sm="10">
            <CFormInput v-model="nameToUpdate" required placeholder="Nom d'expertise" id="name" />
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CFormLabel for="inputDescription" class="col-sm-2 col-form-label"
            >Description</CFormLabel
          >
          <CCol sm="10">
            <CFormTextarea
              v-model="descriptionToUpdate"
              placeholder="Description de l'expertise"
              rows="3"
            />
          </CCol>
        </CRow>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="primary" @click="updateExpertise">Confirmer</CButton>
    </CModalFooter>
  </CModal>
   
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { CTableDataCell } from '@coreui/vue'
import ExpertiseItem from '../UI/home/service/expertise-item.vue'
import { domains } from '@/environement'
const alert = ref('')
const router = useRouter()
const home = ref(null) // Home data including services and expertises
const message = ref('')
const expertises = ref([])
const visibleScrollableDemo = ref(false)
const name = ref('')
const description = ref('')


const visibleModal = ref(false)
const nameToUpdate = ref('')
const descriptionToUpdate = ref('')
const selectedExpertiseId = ref(null)

const visibleModalService = ref(false)
const services = ref('')

// Fetch home entry when the component is mounted
onMounted(async () => {
  const storedMessage = localStorage.getItem('Message')
  if (storedMessage) {
    alert.value = storedMessage
    localStorage.removeItem('Message')
    setTimeout(() => {
      alert.value = ''
    }, 3000)
  }
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

    // Assuming there's only one home entry
    if (response.data.length > 0) {
      home.value = response.data[0]
      expertises.value = home.value.expertises
    } else {
      message.value = 'No home entry found.'
    }
  } catch (error) {
    message.value = 'Error fetching home entry. Please try again later.'
    console.error('Error fetching home:', error)
  }
})

const refreshExpertises = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get( domains + '/homes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expertises.value = response.data[0].expertises
  } catch (error) {
    console.error('Error refreshing expertises:', error)
  }
}
const refreshServises = async () => {
  try {
    console.log('refresh services is working')
    const token = localStorage.getItem('token')
    const response = await axios.get( domains + '/homes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    home.value=response.data[0]
  } catch (error) {
    console.error('Error refreshing services:', error)
  }
}

// Function to set the alert message
const setAlert = (message) => {
  alert.value = message
  setTimeout(() => {
    alert.value = '' // Clear the alert after 3 seconds
  }, 3000)
}

// Submit the form data of ADDing an expertise
const submitForm = async () => {
  const token = localStorage.getItem('token')
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found, please log in.')
    }

    const newExpertise = {
      name: name.value,
      description: description.value,
    }

    const response = await axios.put( domains + '/homes/expertise/add', newExpertise, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('response', response)

    // Optionally clear the form
    name.value = ''
    description.value = ''
    visibleScrollableDemo.value = false
    refreshExpertises()

    setAlert('Expertise ajoutée avec succès!')
  } catch (error) {
    console.log('Token:', token)
    console.error('Error creating expertise:', error.response ? error.response.data : error.message)
    message.value =
      'Error creating expertise: ' + (error.response ? error.response.data.message : error.message)
  }
}

// Handle the event from the child component
const handleOpenUpdateModal = async ({ visibleModal: isVisible, expertiseId }) => {
  visibleModal.value = isVisible
  selectedExpertiseId.value = expertiseId

  // Fetch the data for the selected expertise
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get( domains + `/homes/expertise/${expertiseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Populate the modal form with the expertise data
    const expertise = response.data
    nameToUpdate.value = expertise.name
    descriptionToUpdate.value = expertise.description
  } catch (error) {
    console.error('Error fetching expertise data:', error)
  }
}

// Function to update the expertise
const updateExpertise = async () => {
  try {
    const token = localStorage.getItem('token')
    const updatedExpertise = {
      name: nameToUpdate.value,
      description: descriptionToUpdate.value,
    }

    await axios.put( domains + `/homes/expertise/update/${selectedExpertiseId.value}`, updatedExpertise, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    visibleModal.value = false
    refreshExpertises()
    services.value = home.value.services
  } catch (error) {
    console.error('Error updating expertise:', error)
  }
}
const openModalService = () =>{
  visibleModalService.value = true
  services.value = home.value.services
}

const updateService = async ()=>{
  const token = localStorage.getItem('token')
    try {
      const response = await axios.put( domains + `/homes/update/${home.value._id}`, 
        {
          services: services.value,
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      visibleModalService.value = false
      setAlert('services modifié avec succès!')
      refreshServises()
    } catch (error) {
      message.value = 'Erreur lors de la mise à jour du service: ' + (error.response ? error.response.data.message : error.message)
    }

}
</script>

