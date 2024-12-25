<template>
    <CModal
      size="xl"
      alignment="center"
      scrollable
      :visible="visibleNavLinks"
      @close="$emit('close')"
      aria-labelledby="ManageNavLinksModal"
    >
      <CModalHeader>
        <CModalTitle id="ManageNavLinksModal">Modifier les liens de navigation</CModalTitle>
      </CModalHeader>
  
      <CModalBody>
        <CForm>
          <div v-for="(link, index) in localNavLinks" :key="index" class="mb-4">
            <h5>Nav Link {{ index + 1 }}</h5>
  
            <CRow class="mb-3">
              <CFormLabel :for="'navLinkLabel' + index" class="col-sm-2 col-form-label">Label</CFormLabel>
              <CCol sm="10">
                <CFormInput
                  v-model="link.label"
                  :placeholder="'Enter label for Nav Link ' + (index + 1)"
                  :id="'navLinkLabel' + index"
                />
              </CCol>
            </CRow>
  
            <CRow class="mb-3">
              <CFormLabel :for="'navLinkUrl' + index" class="col-sm-2 col-form-label">Lien vers</CFormLabel>
              <CCol sm="10">
                <CFormSelect v-model="link.url" @change="handleSelectChange($event, index)">
                  <option value="/contact">Page Contact</option>
                  <option value="/nosrealisations">Page Nos villas</option>
                  <option value="/blog">Page Blogs</option>
                  <option value="/FAQ">Page FAQ</option>
                  <option value="/a_propos_de_nous">Page A Propos De Nous</option>
                  <option :value="`mailto:${email}`">Email</option>
                  <option value="custom">Autre</option>
                </CFormSelect>
              </CCol>
            </CRow>
  
            <!-- Show custom input field if "Autre" (Other) is selected -->
            <CRow class="mb-3" v-if="link.isCustomInput">
              <CFormLabel :for="'customNavLink' + index" class="col-sm-2 col-form-label">Autre Lien</CFormLabel>
              <CCol sm="10">
                <CFormInput
                  v-model="link.customNavLink"
                  :id="'customNavLink' + index"
                  placeholder="Enter custom link"
                />
              </CCol>
            </CRow>
  
            <hr />
          </div>
        </CForm>
      </CModalBody>
  
      <CModalFooter>
        <CButton color="primary" @click="saveLinks">Confirmer</CButton>
        <CButton color="secondary" @click="$emit('close')">Annuler</CButton>
      </CModalFooter>
    </CModal>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  // Props received from parent
  const props = defineProps({
    visibleNavLinks: Boolean,
    navLinks: {
      type: Array,
      required: true,
    },
    email: String,
  });
  
  // Emit events to parent
  const emit = defineEmits(['save', 'close']);
  
  // Local state for nav links
  const localNavLinks = ref(
    props.navLinks.map((link) => ({
      ...link,
      isCustomInput: link.url === 'custom', // Check if custom is pre-selected
      customNavLink: link.url === 'custom' ? '' : link.url, // Custom link placeholder
    }))
  );
  
  // Method to handle select change for each link
  const handleSelectChange = (event, index) => {
    const value = event.target.value;
    localNavLinks.value[index].url = value;
    localNavLinks.value[index].isCustomInput = value === 'custom';
  };
  
  // Method to save the updated links
  const saveLinks = () => {
    localNavLinks.value = localNavLinks.value.map((link) => ({
      ...link,
      url: link.isCustomInput ? link.customNavLink : link.url, // Use custom link if selected
    }));
  
    emit('save', localNavLinks.value);
    emit('close');
  };
  
  // Watcher to update local value when props change
  watch(
    () => props.navLinks,
    (newLinks) => {
      localNavLinks.value = newLinks.map((link) => ({
        ...link,
        isCustomInput: link.url === 'custom',
        customNavLink: link.url === 'custom' ? '' : link.url,
      }));
    },
    { immediate: true } // To run the watcher on component mount
  );
  </script>
  
  <style scoped>
  /* Adjusting spacing between form groups */
  .mb-4 {
    margin-bottom: 1.5rem;
  }
  </style>
  