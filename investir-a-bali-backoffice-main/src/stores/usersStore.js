import { defineStore } from 'pinia';
import axios from 'axios';
import { domains } from '../environement'

export const useUsersStore = defineStore('usersStore', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null,
  }),

  actions: {
    // Fetch user profile data from backend
    async fetchUserProfile() {
      this.isLoading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (!token) {
          throw new Error('Token not found');
        }

        // Make an API request to fetch the user's profile
        const response = await axios.get( domains + '/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If the response is successful, store the user data
        this.user = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Update user profile data
    async updateUserProfile(profile, selectedFile) {
      this.isLoading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const formData = new FormData();
        formData.append('firstName', profile.firstName);
        formData.append('lastName', profile.lastName);
        formData.append('email', profile.email);
        formData.append('phoneNumber', profile.phoneNumber);

        // If a file (avatar) is selected, append it to the form data
        if (selectedFile) {
          formData.append('avatar', selectedFile);
        }

        // Make an API request to update the user's profile
        const response = await axios.put( domains + `/users/update/${this.user._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Ensure multipart for file upload
          },
        });

        // Update the user profile in the store
        this.user = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
