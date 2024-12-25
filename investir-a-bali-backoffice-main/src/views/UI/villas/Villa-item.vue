<template>
    <CTableRow>
      <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
      <CTableDataCell>{{ villa.villaname }}</CTableDataCell>
      <CTableDataCell>{{ villa.location }}</CTableDataCell>
      <!-- <CTableDataCell>{{ villa.description }}</CTableDataCell> -->
      <CTableDataCell>{{ villa.price }}</CTableDataCell>
      <CTableDataCell>{{ villa.nb_bedroom }}</CTableDataCell>
      <!-- <CTableDataCell>{{ villa.nb_livingroom }}</CTableDataCell>
      <CTableDataCell>{{ villa.nb_bathroom }}</CTableDataCell>
      <CTableDataCell>{{ villa.nb_pool }}</CTableDataCell>
      <CTableDataCell>{{ villa.parking_capacity }}</CTableDataCell> -->
      <CTableDataCell>{{ villa.area }}</CTableDataCell>
      <!-- <CTableDataCell>
        <ul>
          <li v-for="img in villa.img_album" :key="img">
            <img :src="img" alt="villa image" width="50" height="50" />
          </li>
        </ul>
      </CTableDataCell> -->
      <CTableDataCell class="actions">
        <CButton color="primary" variant="outline" size="sm" @click="redirectToUpdateVilla(villa._id)"
          >Modifier</CButton
        >
        <CButton color="secondary" size="sm" @click="openDeleteModal(villa._id, villa.villaname)">
          Supprimer</CButton
        >
      </CTableDataCell>
    </CTableRow>
  

    <!-- Delete Confirmation Modal -->

  <CModal 
    :visible="visibleLiveDemo"
    @close="() => { visibleLiveDemo = false }"
    aria-labelledby="LiveDemoExampleLabel"
    style="border-radius: 12px;"
  >
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel">Confirmer la suppression !</CModalTitle>
    </CModalHeader>
    <CModalBody>Voulez-vous supprimer la villa "{{ villaToDeleteName }}" ? </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeModal">
        Annuler
      </CButton>
      <CButton color="primary" variant="outline" @click="confirmDelete">Supprimer</CButton>
    </CModalFooter>
  </CModal>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { defineProps } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import { domains } from '@/environement'
  // Define props
  const props = defineProps({
    villa: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    refreshVillas: {
      type: Function,
      required: true,
    },
    setAlert: {
      type: Function,
      required: true,
    },
  })
  
  const router = useRouter()
  const villaToDeleteId = ref(null)
  const villaToDeleteName = ref('')
  const visibleLiveDemo = ref(false)
  
  const redirectToUpdateVilla = (id) => {
    router.push(`/villas-management/update-villa/${id}`)
  }
  
  // Open Delete Modal
  const openDeleteModal = (id, villaname) => {
    villaToDeleteId.value = id
    villaToDeleteName.value = villaname
    visibleLiveDemo.value = true
  }
  
  // Close Modal without deleting
  const closeModal = () => {
    villaToDeleteId.value = null
    villaToDeleteName.value = ''
    visibleLiveDemo.value = false
  }
  
  // Confirm Deletion and Call API
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete( domains + `/villas/delete/${villaToDeleteId.value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // Refresh the villas list after deletion
      props.refreshVillas()
  
      // Set the success alert message
      props.setAlert('Villa supprimée avec succès!')
  
      // Close the modal
      closeModal()
    } catch (error) {
      console.error('Error deleting villa:', error.response ? error.response.data : error.message)
    }
  }
  </script>
  
  <style scoped>
  .actions {
    display: flex;
    gap: 1rem;
  }
  </style>
  