<template>
    <CModal
      size="xl"
      alignment="center"
      scrollable
      :visible="visiblePhone"
      @close="$emit('close')"
      aria-labelledby="ScrollingLongContentExampleLabel2"
    >
      <CModalHeader>
        <CModalTitle id="ScrollingLongContentExampleLabel2">Modifier télephone</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CRow class="mb-3">
            <CFormLabel for="phoneLabel" class="col-sm-2 col-form-label">Label</CFormLabel>
            <CCol sm="10">
              <CFormInput
                v-model="localPhoneLabel"
                placeholder="label"
              />
            </CCol>
          </CRow>
          <CRow class="mb-3">
            <CFormLabel for="phoneNumber" class="col-sm-2 col-form-label">Numéro téléphone</CFormLabel>
            <CCol sm="10">
              <CFormInput
                v-model="localPhoneNumber"
                placeholder="numéro"
              />
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" @click="updatePhone">Confirmer</CButton>
      </CModalFooter>
    </CModal>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    visiblePhone: Boolean,
    phoneLabel: String,
    phoneNumber: String,
  });
  const emit = defineEmits(['updated', 'close']);
  
  const localPhoneLabel = ref(props.phoneLabel);
  const localPhoneNumber = ref(props.phoneNumber);
  
  const updatePhone = () => {
    // Emit the updated data back to the parent component
    const updatedPhone = {
      label: localPhoneLabel.value,
      url: localPhoneNumber.value,
    };
    emit('updated', updatedPhone);
    emit('close');
  };
  
  watch(
    () => props.phoneLabel,
    (newLabel) => {
      localPhoneLabel.value = newLabel;
    }
  );
  
  watch(
    () => props.phoneNumber,
    (newNumber) => {
      localPhoneNumber.value = newNumber;
    }
  );
  </script>
  