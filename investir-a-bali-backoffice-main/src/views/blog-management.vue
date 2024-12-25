<template>
  <CAlert
    v-if="alert"
    color="success"
    dismissible
    @close="() => (alert = false)"
  >{{ alert }}</CAlert>

  <p v-if="message">{{ message }}</p>

  <CTable v-else caption="top" striped>
    <CTableCaption>
      Liste des Blogs
      <CButton color="primary" size="sm" class="add-blog-btn" @click="redirectToAddBlog">
        Ajouter Blog
      </CButton>
    </CTableCaption>

    <CTableHead>
      <CTableRow>
        <CTableHeaderCell scope="col"></CTableHeaderCell>
        <CTableHeaderCell scope="col">Titre</CTableHeaderCell>
        <CTableHeaderCell scope="col">Description</CTableHeaderCell>
        <CTableHeaderCell scope="col">Image</CTableHeaderCell>
        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
      </CTableRow>
    </CTableHead>

    <CTableBody>
      <BlogItem
        v-for="(blog, index) in blogs"
        :key="blog._id"
        :index="index"
        :blog="blog"
        :refreshBlogs="refreshBlogs"
        :setAlert="setAlert"
      />
    </CTableBody>
  </CTable>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import BlogItem from './UI/blog/Blog-item.vue'
import { domains } from '../environement'

const alert = ref('')
const router = useRouter()
const blogs = ref([])
const message = ref('')

const redirectToAddBlog = () => {
  router.push('/blog-management/add-blog')
}

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
    if (!token) throw new Error('No token found, please log in.')

    const response = await axios.get( domains + '/blogs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    blogs.value = response.data
  } catch (error) {
    message.value = 'Error fetching blogs. Please try again later.'
    console.error('Error fetching blogs:', error)
  }
})

const refreshBlogs = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get( domains + '/blogs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    blogs.value = response.data
  } catch (error) {
    console.error('Error refreshing blogs:', error)
  }
}

const setAlert = (message) => {
  alert.value = message
  setTimeout(() => {
    alert.value = ''
  }, 3000)
}
</script>

<style scoped>
.add-blog-btn {
  margin-left: 50px;
}
</style>
