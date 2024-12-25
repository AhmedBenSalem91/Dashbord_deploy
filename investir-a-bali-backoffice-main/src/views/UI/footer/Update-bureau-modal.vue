<template>
    <CModal
      size="xl"
      alignment="center"
      scrollable
      :visible="visibleBureau"
      @close="$emit('close')"
      aria-labelledby="ScrollingLongContentExampleLabel2"
    >
      <CModalHeader>
        <CModalTitle id="ScrollingLongContentExampleLabel2">Modifier Adresse du Bureau</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CRow class="mb-3">
            <CFormLabel for="phoneLabel" class="col-sm-2 col-form-label">Label</CFormLabel>
            <CCol sm="10">
              <CFormInput
                v-model="localBureauLabel"
                placeholder="label"
              />
            </CCol>
          </CRow>
          <CRow class="mb-3">
            <CFormLabel for="phoneNumber" class="col-sm-2 col-form-label">Adresse Bureau</CFormLabel>
            <CCol sm="10">
              <CFormInput
                v-model="localBureauAdresse"
                placeholder="localisation"
              />
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" @click="updateBureau">Confirmer</CButton>
      </CModalFooter>
    </CModal>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    visibleBureau: Boolean,
    bureauLabel: String,
    bureauAdresse: String,
  });
  const emit = defineEmits(['updated', 'close']);
  
  const localBureauLabel = ref(props.bureauLabel);
  const localBureauAdresse = ref(props.bureauAdresse);
  
  const updateBureau = () => {
    // Emit the updated data back to the parent component
    const updatedBureau = {
      label: localBureauLabel.value,
      url: localBureauAdresse.value,
    };
    emit('updated', updatedBureau);
    emit('close');
  };
  
  watch(
    () => props.bureauLabel,
    (newLabel) => {
      localBureauLabel.value = newLabel;
    }
  );
  
  watch(
    () => props.bureauAdresse,
    (newAdresse) => {
      localBureauAdresse.value = newAdresse;
    }
  );
  </script>
  