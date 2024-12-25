<script setup>
import { CChartDoughnut } from '@coreui/vue-chartjs'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { domains } from '@/environement'

const analyticsData = ref(null)
const error = ref(null)
const headers = ref([])
const values = ref([])
const result = ref()
const arrayTransformed = ref()
const selectedFilter = ref('month')

// Function to fetch analytics data based on the selected filter
const fetchAnalyticsData = async () => {
  error.value = null

  try {
    const response = await axios.get( domains + '/api/get-analytics-data', {
      params: {
        'metrics[name]': 'screenPageViews',
        'dimensions[name]': 'pagePath',
        'rangeType': selectedFilter.value,
      },
    })

    analyticsData.value = response.data
    headers.value = analyticsData.value.values.headers
    values.value = analyticsData.value.values.values
  
    result.value = separateFichevilla(headers.value, values.value)
    arrayTransformed.value = transformOtherArray(result.value.otherArray, result.value.otherValues)

    console.log('Separated result:', result.value)
  } catch (err) {
    error.value = 'Failed to fetch analytics data'
    console.error(err)
  }
}

// Function to separate 'fichevilla' and other pages
function separateFichevilla(headers, values) {
  const villaArray = []
  const villaValues = [] 
  const otherArray = []
  const otherValues = [] 

  headers.forEach((header, index) => {
    if (header.includes('fichevilla')) {
      villaArray.push(header)
      villaValues.push(values[index])
    } else {
      otherArray.push(header)
      otherValues.push(values[index])
    }
  })

  return { villaArray, villaValues, otherArray, otherValues }
}

// Function to transform otherArray into user-friendly names
function transformOtherArray(otherArray, otherValues) {
  const newArray = [];
  const newValues = [];

  const pathMap = {
    "/nosrealisations": "pages des villas",
    "/blog": "page blog",
    "/equipecomplet": "page equipe complet",
    "/contact": "page contact",
    "/a_propos_de_nous": "page a propos de nous",
    "/timelineprocess": "page nos process",
    "/FAQ": "page FAQ",
    "/": "page Home"
  };

  otherArray.forEach((item, index) => {
    if (pathMap[item]) {
      newArray.push(pathMap[item]);
      newValues.push(otherValues[index]);
    }
  });

  return { newArray, newValues };
}

// Fetch data on component mount
onMounted(() => {
  fetchAnalyticsData()
})

// Update chart data based on transformed array
const chartData = computed(() => {
  if (arrayTransformed.value) {
    return {
      labels: arrayTransformed.value.newArray,
      datasets: [
        {
          label: 'Number of views',
          backgroundColor: [
            '#41B883', '#E46651', '#00D8FF', '#DD1B16', '#FFC107', 
            '#8E44AD', '#3498DB', '#FF8C00', '#2ECC71'
          ],
          data: arrayTransformed.value.newValues,
        },
      ],
    }
  }
  return null;
})

// Handle filter change and re-fetch data based on the new filter
const handleFilterChange = (filter) => {
  if (selectedFilter.value !== filter) {
    selectedFilter.value = filter
    fetchAnalyticsData() // Re-fetch data when the filter changes
  }
}
</script>

<template>
  <CRow>
    <CCol :sm="5"> </CCol>
    <CCol :sm="7" class="d-none d-md-block">
      <CButtonGroup class="float-end me-3" role="group" aria-label="Filter by month or year">
        <CButton 
          color="secondary" 
          variant="outline" 
          :active="selectedFilter === 'month'"
          @click="handleFilterChange('month')"
        >
          Month
        </CButton>
        <CButton 
          color="secondary" 
          variant="outline" 
          :active="selectedFilter === 'year'"
          @click="handleFilterChange('year')"
        >
          Year
        </CButton>
      </CButtonGroup>
    </CCol>
  </CRow>
  <CChartDoughnut v-if="chartData" :data="chartData" />
  <p v-if="error">{{ error }}</p>
</template>
