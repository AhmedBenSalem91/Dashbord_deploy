<template>
    <CForm>
      <CRow class="mb-3">
        <CFormLabel for="title" class="col-sm-2 col-form-label">Titre</CFormLabel>
        <CCol sm="10">
          <CFormInput v-model="title" required placeholder="Titre" id="title" />
        </CCol>
      </CRow>
      <CRow class="mb-3">
        <CFormLabel for="description" class="col-sm-2 col-form-label">Description</CFormLabel>
        <CCol sm="10">
          <CFormTextarea v-model="description" required placeholder="Description" id="description" />
        </CCol>
      </CRow>
      <CRow class="mb-3">
        <CFormLabel for="image" class="col-sm-2 col-form-label">Image</CFormLabel>
        <CCol sm="10">
          <CFormInput type="file" @change="handleImageUpload" id="image" />
        </CCol>
      </CRow>
  
      <!-- Image Preview -->
      <CRow v-if="imagePreview" class="mb-3">
        <CCol sm="10" class="offset-sm-2">
          <img :src="imagePreview" alt="Image Preview" class="image-preview" />
        </CCol>
      </CRow>
  
      <CButton color="primary" @click="submitForm">Mettre à jour</CButton>
    </CForm>
    <p v-if="message">{{ message }}</p>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter, useRoute } from 'vue-router'
  import { domains } from '@/environement'
  
  const title = ref('')
  const description = ref('')
  const image = ref(null)
  const imagePreview = ref(null)
  const message = ref('')
  const router = useRouter()
  const route = useRoute()
  
  const blogId = route.params.id
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    image.value = file
  
    if (file) {
      imagePreview.value = URL.createObjectURL(file)
    }
  }
  
  const loadBlogData = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get( domains + `/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      const blog = response.data
      title.value = blog.title
      description.value = blog.description
    } catch (error) {
      message.value = 'Error loading blog data: ' + (error.response ? error.response.data.message : error.message)
    }
  }
  
  const submitForm = async () => {
    const token = localStorage.getItem('token')
    try {
      const formData = new FormData()
      formData.append('title', title.value)
      formData.append('description', description.value)
  
      if (image.value) {
        formData.append('image', image.value)
      }
  
      // Send PUT request to update the blog
      await axios.put( domains + `/blogs/update/${blogId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
  
      message.value = 'Blog updated successfully!'
      localStorage.setItem('Message', 'Blog modifié avec succès!')
      router.push('/blog-management')
  
    } catch (error) {
      message.value = 'Error updating blog: ' + (error.response ? error.response.data.message : error.message)
    }
  }
  
  onMounted(() => {
    loadBlogData()
  })
  </script>
  
  <style scoped>
  .image-preview {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
  }
  </style>
  