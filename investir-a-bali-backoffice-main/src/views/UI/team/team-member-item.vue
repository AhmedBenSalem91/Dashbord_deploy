<template>
    <CTableRow>
      <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
      <CTableDataCell>{{ member.name }}</CTableDataCell>
      <CTableDataCell>{{ member.memberRole }}</CTableDataCell>
      <CTableDataCell>{{ member.email }}</CTableDataCell>

      <CTableDataCell>
      <CAvatar size="lg" :src=" domains + `/uploads/team-members/${member.avatar}`"/>
    </CTableDataCell>
      <CTableDataCell class="actions">
        <CButton color="primary" variant="outline" size="sm" @click="redirectToUpdateMember(member._id)">
          Modifier
        </CButton>
        <CButton color="secondary" size="sm" @click="openDeleteModal(member._id, member.name)">
          Supprimer
        </CButton>
      </CTableDataCell>
    </CTableRow>
  
    <!-- Delete Confirmation Modal -->
    <CModal :visible="visibleLiveDemo" @close="() => (visibleLiveDemo = false)">
      <CModalHeader>
        <CModalTitle>Confirmer la suppression !</CModalTitle>
      </CModalHeader>
      <CModalBody>
        Voulez-vous supprimer le membre "{{ memberToDeleteName }}" ?
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeModal">Annuler</CButton>
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
    member: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    refreshTeam: {
      type: Function,
      required: true,
    },
    setAlert: {
      type: Function,
      required: true,
    },
  })
  
  const router = useRouter()
  const memberToDeleteId = ref(null)
  const memberToDeleteName = ref('')
  const visibleLiveDemo = ref(false)
  
  const redirectToUpdateMember = (id) => {
    router.push(`/team-management/update-member/${id}`)
  }
  
  // Open Delete Modal
  const openDeleteModal = (id, name) => {
    memberToDeleteId.value = id
    memberToDeleteName.value = name
    visibleLiveDemo.value = true
  }
  
  // Close Modal without deleting
  const closeModal = () => {
    memberToDeleteId.value = null
    memberToDeleteName.value = ''
    visibleLiveDemo.value = false
  }
  
  // Confirm Deletion and Call API
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete( domains + `/team-members/delete/${memberToDeleteId.value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // Refresh the team list after deletion
      props.refreshTeam()
      // Set the success alert message
      props.setAlert('Membre supprimé avec succès!')
      // Close the modal
      closeModal()
    } catch (error) {
      console.error('Error deleting team member:', error.response ? error.response.data : error.message)
    }
  }
  </script>
  
  <style scoped>
  .actions {
    display: flex;
    gap: 1rem;
  }
  </style>
  