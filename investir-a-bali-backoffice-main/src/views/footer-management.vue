<template>
  <CAlert v-if="alert" color="success" dismissible @close="() => (alert = false)">{{
    alert
  }}</CAlert>

  <p v-if="message">{{ message }}</p>
  <!-- phone -->
  <div >
    <CTable caption="top" striped v-if="phoneLink">
      <CTableCaption> Téléphone </CTableCaption>

      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">Numéro télephone</CTableHeaderCell>
          <CTableHeaderCell scope="col"
            ><CButton
              color="primary"
              variant="outline"
              size="sm"
              @click="openPhoneModal"
            >
              Modifier
            </CButton></CTableHeaderCell
          >
        </CTableRow>
      </CTableHead>

      <CTableBody>
        <CTableRow>
          <CTableDataCell class="data-cell" cope="row">{{ phoneLink.url }}</CTableDataCell>
          <CTableDataCell style="width: 20%" class="actions"> </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>

    <!-- whatsapp -->
    <CTable caption="top" striped v-if="whatsappLink">
      <CTableCaption> WhatsApp </CTableCaption>

      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">Numéro WhatsApp</CTableHeaderCell>
          <CTableHeaderCell scope="col"
            ><CButton
              color="primary"
              variant="outline"
              size="sm"
              @click="openWhatsappModal"
            >
              Modifier
            </CButton></CTableHeaderCell
          >
        </CTableRow>
      </CTableHead>

      <CTableBody>
        <CTableRow>
          <CTableDataCell class="data-cell" scope="row">+{{ whatsappLink.url }}</CTableDataCell>
          <CTableDataCell style="width: 20%" class="actions"> </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>

    <!-- link to contact-->
    <CTable caption="top" striped v-if="contactLink">
      <CTableCaption> Lien de contact </CTableCaption>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">Label</CTableHeaderCell>
          <CTableHeaderCell scope="col">Lien vers</CTableHeaderCell>
          <CTableHeaderCell scope="col"
            ><CButton
              color="primary"
              variant="outline"
              size="sm"
              @click="openContactLinkModal"
            >
              Modifier
            </CButton></CTableHeaderCell
          >
        </CTableRow>
      </CTableHead>

      <CTableBody>
        <CTableRow>
          <CTableDataCell class="data-cell" scope="row">{{ contactLink.label }}</CTableDataCell>
          <CTableDataCell class="data-cell" scope="row">{{ contactLink.url }}</CTableDataCell>
          <CTableDataCell style="width: 20%" class="actions"> </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>

    <!-- liens de navigation -->
    <CTable caption="top" striped v-if="navLinks">
      <CTableCaption> Liens de navigation </CTableCaption>
      <CTableHead>
        <CTableRow> </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="col"></CTableHeaderCell>
          <CTableHeaderCell scope="col">Label</CTableHeaderCell>
          <CTableHeaderCell scope="col">Lien vers</CTableHeaderCell>
          <CTableHeaderCell scope="col"
            ><CButton
              color="primary"
              variant="outline"
              size="sm"
              @click="openNavLinksModal"
            >
              Modifier
            </CButton></CTableHeaderCell
          >
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <!-- v-for navlink in navlinks -->
        <CTableRow v-for="(link, index) in navLinks" :key="index">
          <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
          <CTableDataCell class="data-cell" scope="row">{{ link.label }}</CTableDataCell>
          <CTableDataCell class="data-cell" scope="row">{{ link.url }}</CTableDataCell>
          <CTableDataCell style="width: 20%" class="actions"> </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>


    <!-- email -->
    <CTable caption="top" striped v-if="emailLink">
      <CTableCaption> Email </CTableCaption>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">Label</CTableHeaderCell>
          <CTableHeaderCell scope="col">Adresse Email</CTableHeaderCell>
          <CTableHeaderCell scope="col"
            ><CButton
              color="primary"
              variant="outline"
              size="sm"
              @click="openEmailModal"
            >
              Modifier
            </CButton></CTableHeaderCell
          >
        </CTableRow>
      </CTableHead>

      <CTableBody>
        <CTableRow>
          <CTableDataCell class="data-cell" scope="row">{{ emailLink.label }}</CTableDataCell>
          <CTableDataCell class="data-cell" scope="row">{{ emailLink.url}}</CTableDataCell>
          <CTableDataCell style="width: 20%" class="actions"> </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>


    <!-- bureau -->
    <CTable caption="top" striped v-if="bureauLink">
      <CTableCaption> Bureau </CTableCaption>

      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">Adresse Bureau</CTableHeaderCell>
          <CTableHeaderCell scope="col"
            ><CButton
              color="primary"
              variant="outline"
              size="sm"
              @click="openBureauModal"
            >
              Modifier
            </CButton></CTableHeaderCell
          >
        </CTableRow>
      </CTableHead>

      <CTableBody>
        <CTableRow>
          <CTableDataCell class="data-cell" scope="row">{{ bureauLink.label }}</CTableDataCell>
          <CTableDataCell style="width: 20%" class="actions"> </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  </div>
  <UpdatePhoneModal
    :visiblePhone="visibleModalPhone"
    :phone-label="phoneLink?.label"
    :phone-number="phoneLink?.url"
    @close="closePhoneModal"
    @updated="handlePhoneUpdated"
  />
  <UpdateWhatsappModal
    :visibleWhatsapp="visibleModalWhatsapp"
    :whatsapp-label="whatsappLink?.label"
    :whatsapp-number="whatsappLink?.url"
    @close="closeWhatsappModal"
    @updated="handleWhatsappUpdated"
  />
  <UpdateContactLinkModal
  :visibleContactLink="visibleModalContactLink"
  :contactLabel="contactLink?.label"
  :contactLink="contactLink?.url"
  :email="emailLink?.url"
  @updated="handleContactLinkUpdated"
  @close="closeContactLinkModal"
/>
<UpdateNavLinksModal
:visibleNavLinks="visibleModalNavLinks"
  :navLinks="navLinks"
  :email="emailLink?.url"
  @save="handleNavLinksUpdated"
  @close="closeNavLinksModal"/>
  <UpdateEmailModal
  :visibleEmail="visibleModalEmail"
    :emailLabel="emailLink?.label"
    :emailAdresse="emailLink?.url"
    @close="closeEmailModal"
    @updated="handleEmailUpdated"/>
    <UpdateBureauModal
    :visibleBureau="visibleModalBureau"
    :bureauLabel="bureauLink?.label"
    :bureauAdresse="bureauLink?.url"
    @close="closeBureauModal"
    @updated="handleBureauUpdated"/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import UpdatePhoneModal from './UI/footer/Update-phone-modal.vue';
import UpdateWhatsappModal from './UI/footer/Update-whatsapp-modal.vue';
import UpdateContactLinkModal from './UI/footer/Update-contactLink-modal.vue';
import UpdateNavLinksModal from './UI/footer/Update-navLinks-modal.vue';
import UpdateEmailModal from './UI/footer/Update-email-modal.vue';
import UpdateBureauModal from './UI/footer/Update-bureau-modal.vue';
import { domains } from '../environement'


const alert = ref('')
const message = ref('')
const phoneLink = ref(null)
const whatsappLink = ref(null)
const contactLink = ref(null)
const navLinks = ref([])
const emailLink = ref('')
const bureauLink = ref('')

const visibleModalPhone = ref(false);
const visibleModalWhatsapp = ref(false);
const visibleModalContactLink = ref(false);
const visibleModalNavLinks = ref(false)
const visibleModalEmail = ref(false)
const visibleModalBureau = ref(false)




const fetchFooterData = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get( domains + '/links', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = response.data
    phoneLink.value = data.find(link => link.type === 'phone');
    whatsappLink.value = data.find(link => link.type === 'whatsapp');
    contactLink.value = data.find(link => link.type === 'contactLink');
    navLinks.value = data.filter(link => link.type === 'nav');
    console.log("here are the nav links baby girl : ", navLinks.value)
    emailLink.value = data.find(link => link.type === 'email');
    bureauLink.value = data.find(link => link.type === 'adresse');
  } catch (error) {
    message.value = 'Error fetching footer data. Please try again later.'
    console.error('Error fetching footer data:', error)
  }
}

// Function to set the alert message
const setAlert = (message) => {
  alert.value = message
  setTimeout(() => {
    alert.value = '' // Clear the alert after 3 seconds
  }, 3000)
}
//for the phone modal
const openPhoneModal = () => {
  visibleModalPhone.value = true;
};
const closePhoneModal = () => {
  visibleModalPhone.value = false;
};
const handlePhoneUpdated = async (updatedPhone) => {
  console.log('updated phone',updatedPhone )
  const token = localStorage.getItem('token')
  try {
    if (!token) {
      throw new Error('No token found, please log in.')
    }
    const response = await axios.put( domains + `/links/update/${phoneLink.value._id}`, updatedPhone, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setAlert("Numéro de telf modifié avec succés!")
    fetchFooterData()
  } catch (error) {
    console.error('Error updating phone number:', error.response ? error.response.data : error.message)
    message.value =
      'Error updating phone: ' + (error.response ? error.response.data.message : error.message)
  }
};

//for whatsapp modal
const openWhatsappModal = () => {
  visibleModalWhatsapp.value = true;
};
const closeWhatsappModal = () => {
  visibleModalWhatsapp.value = false;
};
const handleWhatsappUpdated = async (updatedWhatsapp) => {
  console.log('updated whatsapp',updatedWhatsapp )
  const token = localStorage.getItem('token')
  try {
    if (!token) {
      throw new Error('No token found, please log in.')
    }
    const response = await axios.put( domains + `/links/update/${whatsappLink.value._id}`, updatedWhatsapp, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setAlert("Numéro de whatsapp modifié avec succés!")
    fetchFooterData()
  } catch (error) {
    console.error('Error updating whatsapp number:', error.response ? error.response.data : error.message)
    message.value =
      'Error updating whatsapp: ' + (error.response ? error.response.data.message : error.message)
  }
};

//for contact link modal
const openContactLinkModal = () => {
  visibleModalContactLink.value = true;
};
const closeContactLinkModal = () => {
  visibleModalContactLink.value = false;
};
const handleContactLinkUpdated = async (updatedContactLink) => {
  console.log('updated contactlink',updatedContactLink )
  const token = localStorage.getItem('token')
  try {
    if (!token) {
      throw new Error('No token found, please log in.')
    }
    const response = await axios.put( domains + `/links/update/${contactLink.value._id}`, updatedContactLink, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setAlert("lien de contact modifié avec succés!")
    fetchFooterData()
  } catch (error) {
    console.error('Error updating contact link:', error.response ? error.response.data : error.message)
    message.value =
      'Error updating contact link: ' + (error.response ? error.response.data.message : error.message)
  }
};


//for navlinks modal
const openNavLinksModal = () => {
  visibleModalNavLinks.value = true;
};
const closeNavLinksModal = () => {
  visibleModalNavLinks.value = false;
};
const handleNavLinksUpdated = async (updatedNavLinks) => {
  console.log('updated navlinks',updatedNavLinks )
  const token = localStorage.getItem('token')
  try {
    if (!token) {
      throw new Error('No token found, please log in.')
    }
    for (let i = 0; i <= 6; i++){
    const response = await axios.put( domains + `/links/update/${navLinks.value[i]._id}`, updatedNavLinks[i], {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })}
    setAlert("Lien de navigation modifié avec succés!")
    fetchFooterData()
  } catch (error) {
    console.error('Error updating nav links:', error.response ? error.response.data : error.message)
    message.value =
      'Error updating nav links: ' + (error.response ? error.response.data.message : error.message)
  }
};


//for the adresse email modal
const openEmailModal = () => {
  visibleModalEmail.value = true;
};
const closeEmailModal = () => {
  visibleModalEmail.value = false;
};
const handleEmailUpdated = async (updatedEmail) => {
  console.log('updated Email',updatedEmail )
  const token = localStorage.getItem('token')
  try {
    if (!token) {
      throw new Error('No token found, please log in.')
    }
    const response = await axios.put( domains + `/links/update/${emailLink.value._id}`, updatedEmail, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setAlert("Adresse email modifié avec succés!")
    fetchFooterData()
  } catch (error) {
    console.error('Error updating adresse email:', error.response ? error.response.data : error.message)
    message.value =
      'Error updating adresse email: ' + (error.response ? error.response.data.message : error.message)
  }
};

//for the bureau modal
const openBureauModal = () => {
  visibleModalBureau.value = true;
};
const closeBureauModal = () => {
  visibleModalBureau.value = false;
};
const handleBureauUpdated = async (updatedBureau) => {
  console.log('updated Bureau',updatedBureau )
  const token = localStorage.getItem('token')
  try {
    if (!token) {
      throw new Error('No token found, please log in.')
    }
    const response = await axios.put( domains + `/links/update/${bureauLink.value._id}`, updatedBureau, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setAlert("Bureau modifié avec succés!")
    fetchFooterData()
  } catch (error) {
    console.error('Error updating bureau:', error.response ? error.response.data : error.message)
    message.value =
      'Error updating bureau: ' + (error.response ? error.response.data.message : error.message)
  }
};
onMounted(() => {
  fetchFooterData()
})
</script>

<style scoped>
.actions {
  text-align: right;
}
.data-cell {
  font-weight: normal;
}
</style>
