<template>
    <CTableRow>
      <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
      <CTableDataCell>{{ blog.title }}</CTableDataCell>
      <CTableDataCell>{{ blog.description }}</CTableDataCell>
  
      <CTableDataCell>
        <img style="width: 100%;" :src=" domains + `/uploads/blogs/${blog.image}`" alt="blog-img"/>
      </CTableDataCell>
  
      <CTableDataCell class="actions">
        <CButton color="primary" variant="outline" size="sm" @click="redirectToUpdateBlog(blog._id)">
          Modifier
        </CButton>
        <CButton color="secondary" size="sm" @click="openDeleteModal(blog._id, blog.title)">
          Supprimer
        </CButton>
      </CTableDataCell>
    </CTableRow>
  
    <!-- Delete Confirmation Modal -->
    <CModal :visible="visibleDeleteModal" @close="() => (visibleDeleteModal = false)">
      <CModalHeader>
        <CModalTitle>Confirmer la suppression !</CModalTitle>
      </CModalHeader>
      <CModalBody>
        Voulez-vous supprimer le blog "{{ blogToDeleteTitle }}" ?
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
    blog: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    refreshBlogs: {
      type: Function,
      required: true,
    },
    setAlert: {
      type: Function,
      required: true,
    },
  })
  
  const router = useRouter()
  const blogToDeleteId = ref(null)
  const blogToDeleteTitle = ref('')
  const visibleDeleteModal = ref(false)
  
  const redirectToUpdateBlog = (id) => {
    router.push(`/blog-management/update-blog/${id}`)
  }
  
  // Open Delete Modal
  const openDeleteModal = (id, title) => {
    blogToDeleteId.value = id
    blogToDeleteTitle.value = title
    visibleDeleteModal.value = true
  }
  
  // Close Modal without deleting
  const closeModal = () => {
    blogToDeleteId.value = null
    blogToDeleteTitle.value = ''
    visibleDeleteModal.value = false
  }
  
  // Confirm Deletion and Call API
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete( domains + `/blogs/delete/${blogToDeleteId.value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // Refresh the blog list after deletion
      props.refreshBlogs()
      // Set the success alert message
      props.setAlert('Blog supprimé avec succès!')
      // Close the modal
      closeModal()
    } catch (error) {
      console.error('Error deleting blog:', error.response ? error.response.data : error.message)
    }
  }
  </script>
  
  <style scoped>
  .actions {
    display: flex;
    gap: 1rem;
  }
  </style>
  