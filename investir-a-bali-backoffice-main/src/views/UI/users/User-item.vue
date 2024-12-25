<template>
  <CTableRow>
    <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
    <CTableDataCell>{{ user.username }}</CTableDataCell>
    <CTableDataCell>{{ user.email }}</CTableDataCell>
    <CTableDataCell :class="{admin : user.role == 'admin', client : user.role == 'client'}">{{ user.role }}</CTableDataCell>
    <CTableDataCell class="actions">
     <!--  <CButton color="primary" variant="outline" size="sm" @click="redirectToUpdateUser(user._id)"
        >Modifier</CButton
      > -->
      <CButton color="secondary" size="sm" @click="openDeleteModal(user._id, user.username, user.role)">
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
    <CModalBody>Voulez-vous supprimer le {{ userToDeleteRole }} "{{ userToDeleteName }}" ? </CModalBody>
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
  user: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  refreshUsers: {
    type: Function,
    required: true,
  },
  setAlert: {
    type: Function,
    required: true,
  },
})

const router = useRouter()
const userToDeleteId = ref(null)
const userToDeleteName = ref('')
const userToDeleteRole = ref('')
const visibleLiveDemo = ref(false)

/* const redirectToUpdateUser = (id) => {
  router.push(`/users-management/update-user/${id}`)
} */

// Open Delete Modal
const openDeleteModal = (id, username, role) => {
  userToDeleteId.value = id
  userToDeleteName.value = username
  userToDeleteRole.value= role
  visibleLiveDemo.value = true
}

// Close Modal without deleting
const closeModal = () => {
  visibleLiveDemo.value = false
  userToDeleteId.value = null
  userToDeleteName.value = ''
  userToDeleteRole.value= ''
}

// Confirm Deletion and Call API
const confirmDelete = async () => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete( domains + `/users/delete/${userToDeleteId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    props.refreshUsers()

    props.setAlert('Utilisateur supprimé avec succès!')

    closeModal();
   
  } catch (error) {
    console.error('Error deleting user:', error.response ? error.response.data : error.message)
  }
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
.admin{
  color : green;
}
.client{
  color: rgb(88 86 214);
}
</style>
