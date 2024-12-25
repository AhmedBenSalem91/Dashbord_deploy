<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-body-secondary">Sign In to your account</p>

                  <!-- Username Input -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput 
                      placeholder="Username" 
                      autocomplete="username" 
                      v-model="username" 
                    />
                  </CInputGroup>

                  <!-- Password Input -->
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      style="border-radius: 0 6px 6px 0;"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="password"
                    />
                    <i style="margin-top: 10px; padding-left: 10px; cursor: pointer;"
                      :class="['fa', showPassword ? 'fa-eye-slash' : 'fa-eye']"
                      @click="togglePassword"
                    ></i>
                  </CInputGroup>

                  <!-- Error Message -->
                  <div v-if="errorMessage" class="text-danger mb-3">
                    {{ errorMessage }}
                  </div>

                  <!-- Submit Button -->
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" class="px-4" @click="handleLogin">
                        Login
                      </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">Forgot password?</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>
                    If you don't have an account yet,
                    <br />
                    click here to register now!
                  </p>
                  <CButton color="light" variant="outline" class="mt-3" @click="redirectToRegister">
                    Register Now!
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { domains } from '../../environement/index';

console.log('Domains:', domains);

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref(''); // Ref for error message
const router = useRouter();
let tokenCheckInterval;

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  errorMessage.value = ''; // Clear previous errors
  try {
    console.log('Logging in with:', domains);
    const response = await axios.post(domains + '/auth/login', {
      username: username.value,
      password: password.value,
    });
    console.log('Login successful:', response.data);

    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', user.role);

    if (user.role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/client-dashboard');
    }

  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    errorMessage.value =
      error.response?.data?.message || 'An error occurred. Please try again.';
  }
};

const redirectToRegister = () => {
  router.push('/pages/register');
};

onMounted(() => {
  // Clean up interval on component unmount
  return () => clearInterval(tokenCheckInterval);
});
</script>

<style scoped>
/* Add your styles here */
</style>
