<template>
  <div>
    <h3>
      Boîte de Réception
      <span style="font-weight: 100; font-size: large">({{ messages.length }} messages)</span>
    </h3>
    <div v-if="messages.length">
      <div
        v-for="message in messages"
        :key="message._id"
        :class="['message-item', { 'unread-message': !message.isOpened }]"
        @click="showMessageDetails(message._id)"
      >
        <!-- Trash Icon for Deleting the Message -->
        <i class="fas fa-trash-alt delete-icon" @click.stop="deleteMessage(message._id)"></i>

        <h5>
          De : {{ message.name }} <span :class="{'unread-message-adrss': message.isOpened}"><{{ message.email }}></span>
        </h5>
        <small style="color: purple">Sent on: {{ new Date(message.date).toLocaleString() }}</small>
      </div>
    </div>
    <div v-else>
      <p>No messages to show.</p>
    </div>

    <!-- Modal for showing message details -->
    <CModal v-model:visible="isModalVisible" size="lg" @close="closeModal" alignment="center">
      <CModalHeader closeButton>
        <CModalTitle>Message Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div v-if="selectedMessage">
          <div style="display: flex; justify-content: space-between">
            <p>
              <span style="font-weight: 500">Expéditeur:</span> {{ selectedMessage.name }} <{{
                selectedMessage.email
              }}>  <span style="font-weight: 500">tel:</span> {{ selectedMessage.phone }}
            </p>
            <p>{{ new Date(selectedMessage.date).toLocaleString() }}</p>
          </div>
          <p>
            <span style="font-weight: 500">Projets:</span> {{ selectedMessage.projets.join(', ') }}
          </p>
          <p><span style="font-weight: 500">Comment:</span> {{ selectedMessage.comment }}</p>
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeModal">Close</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { domains } from '../environement'

const messages = ref([])
const isModalVisible = ref(false)
const selectedMessage = ref(null)

// Fetch messages
const fetchMessages = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get( domains + '/messages', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    messages.value = response.data
  } catch (error) {
    console.error(error)
  }
}

// Show message details
const showMessageDetails = async (messageId) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get( domains + `/messages/${messageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    selectedMessage.value = response.data
    isModalVisible.value = true
  } catch (error) {
    console.error('Error fetching message details:', error)
  }
  fetchMessages();
}

// Close modal
const closeModal = () => {
  isModalVisible.value = false
  selectedMessage.value = null
  fetchMessages();
}

// Delete message
const deleteMessage = async (messageId) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete( domains + `/messages/delete/${messageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // Remove the message from the list
    messages.value = messages.value.filter((message) => message._id !== messageId)
  } catch (error) {
    console.error('Error deleting message:', error)
    
  }
}

// Fetch messages when the component is mounted
onMounted(fetchMessages)
</script>

<style scoped>
.message-item {
  position: relative;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.message-item:hover {
  background-color: #f1eeee;
}

/* Style for delete icon */
.delete-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  display: none; /* Hide the icon by default */
}

/* Show the delete icon on hover */
.message-item:hover .delete-icon {
  display: block; /* Show the icon when hovering over the message item */
}

.delete-icon:hover {
  color: darkred;
}
.unread-message {
  background-color: #e3f2fd; /* Example: Light blue background for unread messages */
}
.unread-message-adrss{
  font-weight: 400
}
</style>
