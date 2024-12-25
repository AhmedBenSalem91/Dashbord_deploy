<template>
    <CModal
      size="xl"
      alignment="center"
      scrollable
      :visible="visibleEmail"
      @close="$emit('close')"
      aria-labelledby="ScrollingLongContentExampleLabel2"
    >
      <CModalHeader>
        <CModalTitle id="ScrollingLongContentExampleLabel2">Modifier Adresse Email</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CRow class="mb-3">
            <CFormLabel for="phoneLabel" class="col-sm-2 col-form-label">Label</CFormLabel>
            <CCol sm="10">
              <CFormInput
                v-model="localEmailLabel"
                placeholder="label"
              />
            </CCol>
          </CRow>
          <CRow class="mb-3">
            <CFormLabel for="phoneNumber" class="col-sm-2 col-form-label">Adresse email</CFormLabel>
            <CCol sm="10">
              <CFormInput
                v-model="localEmailAdresse"
                placeholder="email"
              />
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" @click="updateEmail">Confirmer</CButton>
      </CModalFooter>
    </CModal>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    visibleEmail: Boolean,
    emailLabel: String,
    emailAdresse: String,
  });
  const emit = defineEmits(['updated', 'close']);
  
  const localEmailLabel = ref(props.emailLabel);
  const localEmailAdresse = ref(props.emailAdresse);
  
  const updateEmail = () => {
    // Emit the updated data back to the parent component
    const updatedEmail = {
      label: localEmailLabel.value,
      url: localEmailAdresse.value,
    };
    emit('updated', updatedEmail);
    emit('close');
  };
  
  watch(
    () => props.emailLabel,
    (newLabel) => {
      localEmailLabel.value = newLabel;
    }
  );
  
  watch(
    () => props.emailAdresse,
    (newAdresse) => {
      localEmailAdresse.value = newAdresse;
    }
  );
  </script>
  