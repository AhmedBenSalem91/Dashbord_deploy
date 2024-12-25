<script setup>
import { CChartBar } from '@coreui/vue-chartjs'
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { domains } from '@/environement'

const analyticsData = ref(null)
const error = ref(null)
const headers = ref([])
const values = ref([])
const result = ref()
const villas = ref([])
const villasinfo = ref()

// Track the active filter
const selectedFilter = ref('year') // Default to 'year'

// Fetch analytics data based on the selected filter
const fetchAnalyticsData = async () => {
  error.value = null
  try {
    const response = await axios.get( domains + '/api/get-analytics-data', {
      params: {
        'metrics[name]': 'screenPageViews',
        'dimensions[name]': 'pagePath',
        rangeType: selectedFilter.value, // Use selectedFilter here
      },
    })
    analyticsData.value = response.data
    headers.value = analyticsData.value.values.headers
    values.value = analyticsData.value.values.values
    result.value = separateFichevilla(headers.value, values.value)
    villasinfo.value = await cretaVillaNames(result.value.villaArray, result.value.villaValues)
    console.log('villa info:', villasinfo.value)
  } catch (err) {
    error.value = 'Failed to fetch analytics data'
    console.error(err)
  }
}

// Update the filter and refetch data when filter changes
const handleFilterChange = (filter) => {
  selectedFilter.value = filter
}

// Watch for changes in selectedFilter to refetch analytics data
watch(selectedFilter, fetchAnalyticsData)

// Function to separate villa paths from others
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

// Function to get villa names with paths in villaArray and values
async function cretaVillaNames(villaArray, villaValues) {
  const villaNames = []
  const villaNamesValues = []
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get( domains + '/villas', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    villas.value = response.data
    villaArray.forEach((path, index) => {
      const villaId = path.split('/fichevilla/')[1]
      const matchedVilla = villas.value.find((villa) => villa._id === villaId)

      if (matchedVilla) {
        villaNames.push(matchedVilla.villaname)
        villaNamesValues.push(villaValues[index])
      }
    })
    return { villaNames, villaNamesValues }
  } catch (error) {
    console.error('Error fetching villas:', error)
    return { villaNames: [], villaNamesValues: [] }
  }
}

// Call the function when the component is mounted
onMounted(() => {
  fetchAnalyticsData()
})

// Chart data
const chartData = computed(() => {
  if (analyticsData.value && villasinfo.value) {
    return {
      labels: villasinfo.value.villaNames,
      datasets: [
        {
          label: 'Number of consultation',
          backgroundColor: 'rgb(228,102,81,0.9)',
          data: villasinfo.value.villaNamesValues,
        },
      ],
    }
  }
})
</script>

<template>
  <CRow>
    <CCol :sm="5"></CCol>
    <CCol :sm="7" class="d-none d-md-block">
      <CButtonGroup class="float-end me-3" role="group" aria-label="Basic outlined example">
        <CButton
          color="secondary"
          variant="outline"
          :active="selectedFilter === 'month'"
          @click="handleFilterChange('month')"
        >Month</CButton>
        <CButton
          color="secondary"
          variant="outline"
          :active="selectedFilter === 'year'"
          @click="handleFilterChange('year')"
        >Year</CButton>
      </CButtonGroup>
    </CCol>
  </CRow>
  <CChartBar :data="chartData" />
</template>
