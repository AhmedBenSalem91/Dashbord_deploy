<script setup>
import { CChartBar } from '@coreui/vue-chartjs'
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { domains } from '@/environement';


const analyticsDataUsersPerCountry = ref(null);
const error = ref(null);
const headers = ref([])
const values = ref([])

const fetchAnalyticsDataUsersPerCountry = async () => {
  error.value = null;

  try {
    const response = await axios.get( domains + '/api/get-analytics-data', {
      params: {
        'metrics[name]': 'activeUsers',
        'dimensions[name]': 'country',
        'rangeType' : 'year'
      },
    });

    analyticsDataUsersPerCountry.value = response.data.values;
    headers.value = analyticsDataUsersPerCountry.value.headers
    values.value = analyticsDataUsersPerCountry.value.values
     // Assuming the structure of your response
  } catch (err) {
    error.value = 'Failed to fetch analytics data';
    console.error(err);
  }
};


// Call the function when the component is mounted
onMounted(() => {
    fetchAnalyticsDataUsersPerCountry();
});


const chartData = computed(() => {
  if (analyticsDataUsersPerCountry.value) {
  return ({
    labels : headers.value,
    datasets : [
    {
      label: 'Number of Active users',
      backgroundColor: '#41B883',
      data: values.value,
    },
    
  ],
  })
}

})

</script>

<template>
  <CChartBar :data="chartData" />
</template>