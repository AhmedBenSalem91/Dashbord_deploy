<template>
  <CRow>
    <CCol :md="6" class="mb-4">
      <WidgetTotalUsers/>
    </CCol>
    <CCol :md="6" class="mb-4">
      <WidgetsEngagedUsers/>
    </CCol>
    <CCol :md="6" class="mb-4">
      <CCard>
        <CCardHeader>Active Users</CCardHeader>
        <CCardBody>
            <CChartLineActiveUsers /></CCardBody>
      </CCard>
    </CCol>
    <CCol :md="6" class="mb-4">
      <CCard>
        <CCardHeader>Most viewed pages</CCardHeader>
        <CCardBody><CChartDoughnutViewedPages/></CCardBody>
      </CCard>
    </CCol>
    <CCol :md="6" class="mb-4">
      <CCard>
        <CCardHeader>New Users</CCardHeader>
        <CCardBody><CChartNewUsers/></CCardBody>
      </CCard>
    </CCol>
    <CCol :md="6" class="mb-4">
      <CCard>
        <CCardHeader>Top consulted Villas</CCardHeader>
        <CCardBody><CChartBarViewedVillas /></CCardBody>
      </CCard>
    </CCol>
    <CCol :md="6" class="mb-4">
      <CCard>
        <CCardHeader>Users From countries</CCardHeader>
        <CCardBody><CChartBarUsersPerCountry /></CCardBody>
      </CCard>
    </CCol>
    <CCol :md="6" class="mb-4">
      <CCard>
        <CCardHeader>Traffic Type</CCardHeader>
        <CCardBody><CChartChannelGroup /></CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script setup>
import {
  CChartLineActiveUsers,
  CChartNewUsers,
  CChartBarViewedVillas,
  CChartDoughnutViewedPages,
  CChartBarUsersPerCountry,
  CChartChannelGroup,
} from '../charts/index.js'
import WidgetTotalUsers from '../widgets/WidgetTotalUsers.vue';
import WidgetsEngagedUsers from '../widgets/WidgetsEngagedUsers.vue';
</script>
