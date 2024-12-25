<template>
    <CModal
      size="xl"
      alignment="center"
      scrollable
      :visible="visibleWhatsapp"
      @close="$emit('close')"
      aria-labelledby="ScrollingLongContentExampleLabel2"
    >
      <CModalHeader>
        <CModalTitle id="ScrollingLongContentExampleLabel2">Modifier Whatsapp</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CRow class="mb-3">
            <CFormLabel for="whatsappLabel" class="col-sm-2 col-form-label">Label</CFormLabel>
          
            <CCol sm="10">
              <CFormInput
                v-model="localWhatsappLabel"
                placeholder="label"
              />
            </CCol>
          </CRow>
          <CRow class="mb-3">
            <CFormLabel for="whatsappNumber" class="col-sm-2 col-form-label">Numéro Whatsapp</CFormLabel>
            <CCol sm="10">
                <div style="display: flex;">
                <p style="margin-top: 14px;">+</p>
              <CFormInput
                v-model="localWhatsappNumber"
                placeholder="numéro"
              />
            </div>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" @click="updateWhatsapp">Confirmer</CButton>
      </CModalFooter>
    </CModal>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    visibleWhatsapp: Boolean,
    whatsappLabel: String,
    whatsappNumber: String,
  });
  const emit = defineEmits(['updated', 'close']);
  
  const localWhatsappLabel = ref(props.whatsappLabel);
  const localWhatsappNumber = ref(props.whatsappNumber);
  
  const updateWhatsapp = () => {
    // Emit the updated data back to the parent component
    const updatedWhatsapp = {
      label: localWhatsappLabel.value,
      url: localWhatsappNumber.value,
    };
    emit('updated', updatedWhatsapp);
    emit('close');
  };
  
  watch(
    () => props.whatsappLabel,
    (newLabel) => {
      localWhatsappLabel.value = newLabel;
    }
  );
  
  watch(
    () => props.whatsappNumber,
    (newNumber) => {
      localWhatsappNumber.value = newNumber;
    }
  );
  </script>
  