<template>
  <CAlert
    v-if="alert"
    color="success"
    dismissible
    @close="() => (alert = false)"
    >{{ alert }}</CAlert
  >
  <p v-if="message">{{ message }}</p>
  <CTable v-else caption="top" striped>
    <CTableCaption>
      Liste des Membres de l'équipe
      <CButton
        color="primary"
        size="sm"
        class="add-member-btn"
        @click="redirectToAddMember"
        >Ajouter Membre</CButton
      >
    </CTableCaption>
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell scope="col"></CTableHeaderCell>
        <CTableHeaderCell scope="col">Prénom</CTableHeaderCell>
        <CTableHeaderCell scope="col">Role</CTableHeaderCell>
        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
        <CTableHeaderCell scope="col">Avatar</CTableHeaderCell>
        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      <TeamMemberItem
        v-for="(member, index) in teamMembers"
        :key="member._id"
        :index="index"
        :member="member"
        :refreshTeam="refreshTeam"
        :setAlert="setAlert"
      />
    </CTableBody>
  </CTable>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import TeamMemberItem from "./UI/team/team-member-item.vue";

import { domains } from "../environement";

const alert = ref("");
const router = useRouter();
const teamMembers = ref([]);
const message = ref("");

const redirectToAddMember = () => {
  router.push("/team-management/add-member");
};

onMounted(async () => {
  const storedMessage = localStorage.getItem("Message");
  if (storedMessage) {
    alert.value = storedMessage;
    localStorage.removeItem("Message");
    setTimeout(() => {
      alert.value = "";
    }, 3000);
  }
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found, please log in.");

    const response = await axios.get(domains + "/team-members", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    teamMembers.value = response.data;
  } catch (error) {
    message.value = "Error fetching team members. Please try again later.";
    console.error("Error fetching team members:", error);
  }
});

const refreshTeam = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(domains + "/team-members", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    teamMembers.value = response.data;
  } catch (error) {
    console.error("Error refreshing team members:", error);
  }
};

const setAlert = (message) => {
  alert.value = message;
  setTimeout(() => {
    alert.value = "";
  }, 3000);
};
</script>

<style scoped>
.add-member-btn {
  margin-left: 50px;
}
</style>
