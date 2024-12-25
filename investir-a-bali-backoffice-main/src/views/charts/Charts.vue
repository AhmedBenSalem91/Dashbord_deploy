<script setup>
import {
  CChartLineActiveUsers,
  CChartDoughnutViewedPages,
  CChartRadarExample,
  CChartPieExample,
  CChartPolarAreaExample,
} from './index.js'
</script>

<template>
  <CRow>
    <CCol :md="6" class="mb-4">
      <CCard>
        <CCardHeader> Line Chart </CCardHeader>
        <CCardBody>
          <CChartLineActiveUsers />
        </CCardBody>
      </CCard>
    </CCol>
    <CCol :md="6" class="mb-4">
      <CCard>
        <CCardHeader>Doughnut Chart</CCardHeader>
        <CCardBody><CChartDoughnutViewedPages /></CCardBody>
      </CCard>
    </CCol>
    <CCol :md="6" class="mb-4">
      <CCard>
        <CCardHeader>Radar Chart</CCardHeader>
        <CCardBody><CChartRadarExample /></CCardBody>
      </CCard>
    </CCol>
    <CCol :md="6" class="mb-4">
      <CCard>
        <CCardHeader>Pie Chart</CCardHeader>
        <CCardBody><CChartPieExample /></CCardBody>
      </CCard>
    </CCol>
    <CCol :md="6" class="mb-4">
      <CCard>
        <CCardHeader>Polar Area Chart</CCardHeader>
        <CCardBody><CChartPolarAreaExample /></CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>
