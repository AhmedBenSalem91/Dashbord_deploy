<template>
    <CModal
      size="xl"
      alignment="center"
      scrollable
      :visible="visibleContactLink"
      @close="$emit('close')"
      aria-labelledby="ScrollingLongContentExampleLabel2"
    >
      <CModalHeader>
        <CModalTitle id="ScrollingLongContentExampleLabel2">Modifier lien de contact</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CRow class="mb-3">
            <CFormLabel for="contactLinkLabel" class="col-sm-2 col-form-label">Label</CFormLabel>
            <CCol sm="10">
              <CFormInput v-model="localContactLinkLabel" placeholder="label" />
            </CCol>
          </CRow>
  
          <!-- Dropdown for Contact Type -->
          <CRow class="mb-3">
            <CFormLabel for="contactLinkType" class="col-sm-2 col-form-label">Type de lien</CFormLabel>
            <CCol sm="10">
              <CFormSelect v-model="localContactLink" @update:modelValue="handleSelectChange">
                <option value="/contact">Page Contact</option>
                <option :value="`mailto:${email}`">Email</option>
                <option value="custom">Autre</option>
              </CFormSelect>
            </CCol>
          </CRow>
  
          <!-- Show custom input field if "Autre" (Other) is selected -->
          <CRow class="mb-3" v-if="isCustomInput">
            <CFormLabel for="customContactLink" class="col-sm-2 col-form-label">Autre Lien</CFormLabel>
            <CCol sm="10">
              <CFormInput
                v-model="customContactLink"
                placeholder="Enter custom link"
              />
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" @click="updateContactLink">Confirmer</CButton>
      </CModalFooter>
    </CModal>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  // Props received from parent
  const props = defineProps({
    visibleContactLink: Boolean,
    contactLabel: String,
    contactLink: String,
    email: String
  });
  
  const emit = defineEmits(['updated', 'close']);
  
  const localContactLinkLabel = ref(props.contactLabel);
  const localContactLink = ref(props.contactLink);
  const customContactLink = ref('');
  const isCustomInput = ref(false);  
  
  const handleSelectChange = (value) => {
    isCustomInput.value = (value === 'custom');
  };
  
  const updateContactLink = () => {
    const finalLink = isCustomInput.value ? customContactLink.value : localContactLink.value;
  
    const updatedContactLink = {
      label: localContactLinkLabel.value,
      url: finalLink,  // Use finalLink instead of localContactLink
    };
    emit('updated', updatedContactLink);
    emit('close');
  };
  
  // Watchers to update local values when props change
  watch(
    () => props.contactLabel,
    (newLabel) => {
      localContactLinkLabel.value = newLabel;
    }
  );
  
  watch(
    () => props.contactLink,
    (newLink) => {
      localContactLink.value = newLink;
    }
  );
  </script>
  