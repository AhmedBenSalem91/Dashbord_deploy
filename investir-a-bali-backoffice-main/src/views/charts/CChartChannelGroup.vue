<template>
    <div v-for="item in chartData" :key="item.title" class="progress-group">
      <div class="progress-group-header">
        <CIcon :icon="item.icon" class="me-2" size="lg" />
        <span class="title">{{ item.title }}</span>
        <span class="ms-auto fw-semibold">
          {{ item.value }}
          <span class="text-body-secondary small">({{ item.percent }}%)</span>
        </span>
      </div>
      <div class="progress-group-bars">
        <CProgress thin :value="item.percent" color="success" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import { domains } from '@/environement'
  
  const analyticsData = ref(null)
  const error = ref(null)
  const headers = ref([])
  const values = ref([])
  
  const fetchAnalyticsData = async () => {
    error.value = null
  
    try {
      const response = await axios.get( domains + '/api/get-analytics-data', {
        params: {
          'metrics[name]': 'sessions',
          'dimensions[name]': 'sessionDefaultChannelGrouping',
          rangeType: 'year',
        },
      })
  
      analyticsData.value = response.data.values
      headers.value = analyticsData.value.headers
      values.value = analyticsData.value.values
    } catch (err) {
      error.value = 'Failed to fetch analytics data'
      console.error(err)
    }
  }
  
  const chartData = computed(() => {
    if (!headers.value.length || !values.value.length) return []
  
    // Calculate total sessions to get percentages
    const totalSessions = values.value.reduce((sum, value) => sum + Number(value), 0)
    return headers.value.map((title, index) => {
      const value = Number(values.value[index])
      const percent = ((value / totalSessions) * 100).toFixed(2)
  
      return { title, value, percent }
    })
  })
  
  onMounted(() => {
    fetchAnalyticsData()
  })
  </script>
  