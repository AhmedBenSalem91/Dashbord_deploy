<template>
    <div class="bwrapper min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow class="justify-content-center">
          <CCol :md="9" :lg="7" :xl="6">
            <CCard class="mx-4">
              <CCardBody class="p-4">
                <CForm @submit.prevent="submitForm">
                  <h1>Register</h1>
                  <p class="text-body-secondary">Create your account</p>
  
                  <!-- Username field (pre-filled) -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput placeholder="Username" v-model="username"/>
                  </CInputGroup>
  
                  <!-- Email field (pre-filled) -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email" v-model="email"/>
                  </CInputGroup>
  
                  <!-- Password fields -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      v-model="password"
                      autocomplete="new-password"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      v-model="confirmPassword"
                      autocomplete="new-password"
                    />
                  </CInputGroup>
  
                  <!-- Submit Button -->
                  <div class="d-grid">
                    <CButton color="success" type="submit">Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import { domains } from '@/environement'
  
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      };
    },
    methods: {  
      async submitForm() {
        if (this.password !== this.confirmPassword) {
          alert('Passwords do not match');
          return;
        }
  
        try {
          const response = await axios.post( domains + `/users/registerNew`, {
            username: this.username,
            email: this.email,
            password: this.password
          });
          this.$router.push('/pages/login');
        } catch (error) {
          console.error('Error completing registration:', error);
        }
      }
    },
  };
  </script>
  