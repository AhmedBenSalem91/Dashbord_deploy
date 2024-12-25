<template>
    <CWidgetStatsA class="mb-3" color="primary">
      <template #value v-if="nbTotalUsers"
        >{{nbTotalUsers}}
      </template>
      <template #title>Total Users</template>
      <template #action>
        <CDropdown placement="bottom-end">
          <CDropdownToggle
            color="transparent"
            class="p-0 text-white"
            :caret="false"
          >
            <CIcon icon="cil-options" class="text-high-emphasis-inverse" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem href="#">Action</CDropdownItem>
            <CDropdownItem href="#">Another action</CDropdownItem>
            <CDropdownItem href="#">Something else here</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </template>
      <template #chart>
        <CChart
          type="line"
          class="mt-3 mx-3"
          style="max-height: 500px"
          :data="chartData"
          :options="{
            plugins: {
              legend: {
                display: false,
              },
            },
            maintainAspectRatio: false,
            scales: {
              x: {
                border: {
                  display: false,
                },
                grid: {
                  display: false,
                  drawBorder: false,
                },
                ticks: {
                  display: false,
                },
              },
              y: {
                min: 0,
                max: 1000,
                display: false,
                grid: {
                  display: false,
                },
                ticks: {
                  display: false,
                },
              },
            },
            elements: {
              line: {
                borderWidth: 1,
                tension: 0.4,
              },
              point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
              },
            },
          }"
        />
      </template>
    </CWidgetStatsA>
</template>

<script setup>
import { CChart } from '@coreui/vue-chartjs'
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { domains } from '@/environement'

const nbTotalUsers = ref();
const analyticsDataTotalUsers = ref(null);
const error = ref(null);
const headers = ref([]);
const values = ref([]);

// Fetch total users
const fetchNbTotalUsers = async () => {
  error.value = null;

  try {
    const response = await axios.get( domains + '/api/get-analytics-data', {
      params: {
        'metrics[name]': 'totalUsers',
        'rangeType': 'year'
      },
    });

    nbTotalUsers.value = response.data.values.values[0];
  } catch (err) {
    error.value = 'Failed to fetch analytics data';
    console.error(err);
  }
};

// Fetch total users per month
const fetchNbTotalUsersPerMonth = async () => {
  error.value = null;

  try {
    const response = await axios.get( domains + '/api/get-analytics-data', {
      params: {
        'metrics[name]': 'totalUsers',
        'dimensions[name]': 'month',
        'rangeType': 'year'
      },
    });

    analyticsDataTotalUsers.value = response.data.values;
    headers.value = analyticsDataTotalUsers.value.headers;
    values.value = analyticsDataTotalUsers.value.values;

  } catch (err) {
    error.value = 'Failed to fetch analytics data';
    console.error(err);
  }
};

// Format month numbers to names
function formatMonth(monthNumbers) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return monthNumbers.map(num => monthNames[num - 1] || 'Invalid month');
}

onMounted(() => {
    fetchNbTotalUsers();
    fetchNbTotalUsersPerMonth();
});

const chartData = computed(() => {
  if (analyticsDataTotalUsers.value) {
    const formattedMonths = formatMonth(headers.value);
    const userValues = values.value.map(v => parseInt(v, 10));
    
    // Calculate dynamic min and max for y-axis
    const maxUserValue = Math.max(...userValues);
    const minUserValue = Math.min(...userValues);
    const dynamicMax = maxUserValue > 10000 ? maxUserValue : 10000;

    return {
      labels: formattedMonths,
      datasets: [
        {
          label: 'Total users',
          backgroundColor: 'transparent',
          borderColor: 'rgba(255,255,255,.55)',
          pointBackgroundColor: '#5856d6',
          data: userValues,
        },
      ],
      options: {
        scales: {
          y: {
            min: minUserValue,
            max: dynamicMax,
            display: true,
            grid: {
              display: true,
            },
            ticks: {
              display: true,
              stepSize: Math.ceil(dynamicMax / 5),
            },
          },
        },
      },
    };
  }
  return {};
});
</script>
