<script setup>
import { CChartPie } from '@coreui/vue-chartjs'
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { domains } from '@/environement'


const analyticsData = ref(null);
const error = ref(null);
const headers = ref([])
const values = ref([])

const fetchAnalyticsData = async () => {
  error.value = null;

  try {
    const response = await axios.get( domains + 'ata', {
      params: {
        'metrics[name]': 'screenPageViews',
        'dimensions[name]': 'pagePath',
      },
    });

    analyticsData.value = response.data;
    console.log('dataaaaaa:', analyticsData.value.values.headers)
    headers.value = analyticsData.value.values.headers
    values.value = analyticsData.value.values.values
     // Assuming the structure of your response
  } catch (err) {
    error.value = 'Failed to fetch analytics data';
    console.error(err);
  }
};
/* function formatDate(yyyymmdd) {
  // Convert the input to a string (in case it's a number)
  const dateStr = String(yyyymmdd);

  // Check if the input is valid (8 digits)
  if (dateStr.length !== 8 || isNaN(dateStr)) {
    throw new Error('Invalid date format. Please use yyyymmdd format.');
  }

  // Extract year, month, and day
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);

  // Return the formatted date
  return `${year}/${month}/${day}`;
} */

// Call the function when the component is mounted
onMounted(() => {
  fetchAnalyticsData();
});


const chartData = computed(() => {
  if (analyticsData.value) {
  return ({
    labels : headers.value,
    datasets : [
    {
      label: 'Number of Total users / day',
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: values.value,
    },
  ],
  })
}

})


/* const data = {
  labels: ['VueJs', 'EmberJs', 'VueJs', 'AngularJs'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [40, 20, 80, 10],
    },
  ],
} */
</script>

<template>
  <CChartPie :data="chartData" />
</template>
