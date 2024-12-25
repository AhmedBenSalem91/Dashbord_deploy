<script setup>
import { CChartLine } from '@coreui/vue-chartjs'
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { domains } from '@/environement'

const analyticsDataActiveUsers = ref(null);
const error = ref(null);
const headersActiveUsers = ref([]);
const valuesActiveUsers = ref([]);
const selectedFilter = ref('month'); 
const isLoading = ref(false);


const fetchAnalyticsDataActiveUsers = async () => {
  error.value = null;
  isLoading.value = true;

  try {
    // Set dimension and range type based on the selected filter
    const dimension = selectedFilter.value === 'month' ? 'date' : 'month';
    const additionalParams = selectedFilter.value === 'year' ? { 'rangeType': 'year' } : {};

    // API request with dynamic parameters
    const response = await axios.get( domains + '/api/get-analytics-data', {
      params: {
        'metrics[name]': 'activeUsers',
        'dimensions[name]': dimension,
        ...additionalParams,
      },
    });

    // Update data and clear loading state
    analyticsDataActiveUsers.value = response.data;
    headersActiveUsers.value = analyticsDataActiveUsers.value.values.headers;
    valuesActiveUsers.value = analyticsDataActiveUsers.value.values.values;
  } catch (err) {
    error.value = 'Failed to fetch analytics data';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// Function to format dates
function formatDate(yyyymmdd) {
  const dateStr = String(yyyymmdd);
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `${year}/${month}/${day}`;
}

// Function to format month numbers to month names
function formatMonth(monthNumbers) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return monthNumbers.map((num) => monthNames[num - 1] || 'Invalid month');
}

// Update chart data only when data is loaded
const chartData = computed(() => {
  if (!analyticsDataActiveUsers.value || isLoading.value) {
    return null; // Return null to prevent updating the chart until data is ready
  }

  const labels = selectedFilter.value === 'year'
    ? formatMonth(headersActiveUsers.value)
    : headersActiveUsers.value.map(formatDate);

  return {
    labels,
    datasets: [
      {
        label: 'Number of Active users',
        backgroundColor: 'rgba(228,102,81,0.9)',
        data: valuesActiveUsers.value,
      },
    ],
  };
});

// Fetch data initially
onMounted(() => {
  fetchAnalyticsDataActiveUsers();
});

// Function to handle filter change
const handleFilterChange = (filter) => {
  selectedFilter.value = filter;
  fetchAnalyticsDataActiveUsers(); // Fetch data based on the new filter
};
</script>

<template>
  <CRow>
    <CCol :sm="5"> </CCol>
    <CCol :sm="7" class="d-none d-md-block">
      <CButtonGroup class="float-end me-3" role="group" aria-label="Basic outlined example">
        <CButton color="secondary" variant="outline" :active="selectedFilter === 'month'"
        @click="handleFilterChange('month')">Month</CButton>
        <CButton color="secondary" variant="outline" :active="selectedFilter === 'year'"
        @click="handleFilterChange('year')">Year</CButton>
      </CButtonGroup>
    </CCol>
  </CRow>
  <CChartLine :data="chartData" />
</template>
