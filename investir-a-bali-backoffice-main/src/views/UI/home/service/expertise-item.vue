<template>
  <CTableRow>
    <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
    <CTableDataCell>{{ expertise.name }}</CTableDataCell>
    <CTableDataCell>{{ expertise.description }}</CTableDataCell>
    <CTableDataCell class="actions">
      <CButton
        color="primary"
        variant="outline"
        size="sm"
        @click="openUpdateExpertiseModal(expertise._id)"
        >Modifier</CButton
      >
      <CButton color="secondary" size="sm" @click="openDeleteModal(expertise._id, expertise.name)">
        Supprimer</CButton
      >
    </CTableDataCell>
  </CTableRow>

  <!-- Delete Confirmation Modal -->

  <CModal
    :visible="visibleLiveDemo"
    @close="
      () => {
        visibleLiveDemo = false
      }
    "
    aria-labelledby="LiveDemoExampleLabel"
    style="border-radius: 12px"
  >
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel">Confirmer la suppression !</CModalTitle>
    </CModalHeader>
    <CModalBody>Voulez-vous supprimer l'expertise "{{ expertiseToDeleteName }}" ? </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeModal"> Annuler </CButton>
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
  expertise: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  refreshExpertises: {
    type: Function,
    required: true,
  },
  setAlert: {
    type: Function,
    required: true,
  },
})
const emit = defineEmits(['openUpdateModal'])

const router = useRouter()
const expertiseToDeleteId = ref(null)
const expertiseToDeleteName = ref('')
const visibleLiveDemo = ref(false)
const visibleModal = ref(false)

// Open Delete Modal
const openDeleteModal = (id, name) => {
  expertiseToDeleteId.value = id
  expertiseToDeleteName.value = name
  visibleLiveDemo.value = true
}

// Close Modal without deleting
const closeModal = () => {
  visibleLiveDemo.value = false
  expertiseToDeleteId.value = null
  expertiseToDeleteName.value = ''
}

// Confirm Deletion and Call API
const confirmDelete = async () => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(
       domains + `/homes/expertise/delete/${expertiseToDeleteId.value}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    props.refreshExpertises()

    props.setAlert('Expertise supprimé avec succès!')

    closeModal()
  } catch (error) {
    console.error('Error deleting expertise:', error.response ? error.response.data : error.message)
  }
}

const openUpdateExpertiseModal = (expertiseId) => {
  emit('openUpdateModal', { visibleModal: true, expertiseId })
}
</script>

<style scoped>
.actions {
  display: flex;
  gap: 1rem;
}
.btns {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.admin {
  color: green;
}
.client {
  color: rgb(88 86 214);
}
</style>
