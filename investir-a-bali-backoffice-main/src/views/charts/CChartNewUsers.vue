<template>
  <CChart
    type="line"
    :wrapper="false"
    :options="{
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            display: false,
          },
          grid : {
            display : false
          }
        },
        x: {
          grid : {
            display : false
          }
        },
      },
    }"
    :data="chartData"
  />
</template>
<script setup>
import { CChart } from '@coreui/vue-chartjs'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { domains } from '@/environement'

const dataNewUsers = ref()
const headers = ref()
const values = ref()
const error = ref(null)

const fetchNewUsersUsers = async () => {
  error.value = null

  try {
    const response = await axios.get( domains + '/api/get-analytics-data', {
      params: {
        'metrics[name]': 'newUsers',
        'dimensions[name]': 'month',
        'rangeType': 'year',
      },
    })
    console.log(response.data)

    dataNewUsers.value = response.data.values
    headers.value = dataNewUsers.value.headers
    values.value = dataNewUsers.value.values
  } catch (err) {
    error.value = 'Failed to fetch analytics data'
    console.error(err)
  }
}

function formatMonth(monthNumbers) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  return monthNumbers.map((num) => monthNames[num - 1] || 'Invalid month')
}

function fillArrayLabelsToLength(arr, targetLength = 12) {
  // Convert each element in the array to a number for manipulation
  let numericArray = arr.map(Number)

  // Determine how many items are needed to reach the target length
  let itemsToAdd = targetLength - numericArray.length

  // Start from the first element and decrease for each new item
  let startValue = numericArray[0]
  for (let i = 1; i <= itemsToAdd; i++) {
    numericArray.unshift(startValue - i)
  }
  return numericArray.map((value) => {
    return value < 1 ? value + 12 : value
  })
}

function fillArrayValuesToLength(arr) {
  while (arr.length < 12) {
    arr.unshift('0');
  }
  return arr;
}



onMounted(() => {
  fetchNewUsersUsers()
})

const chartData = computed(() => {
  if (dataNewUsers.value) {
    let labels = []
    if (headers.value.length < 12) {
      labels = formatMonth(fillArrayLabelsToLength(headers.value))
    } else {
      labels = formatMonth(headers.value)
    }
    const dataSet = fillArrayValuesToLength(values.value)
    console.log('test yosrrr', labels, dataSet)
    return {
      labels: labels,
      datasets: [
        {
          label: 'New Users',
          backgroundColor: 'rgba(151, 187, 205, 0.2)',
          borderColor: 'rgba(151, 187, 205, 1)',
          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
          pointBorderColor: '#fff',
          data: dataSet,
        },
      ],
    }
  }
})
</script>
