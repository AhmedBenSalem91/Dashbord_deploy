<template>
    <CWidgetStatsA class="mb-3" color="danger">
      <template #value v-if="prcEngagedUsers"
        >{{(prcEngagedUsers * 100).toFixed(2)}} %
      </template>
      <template #title>Engaged Sessions</template>
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
          type="bar"
          class="mt-3 mx-3"
          style="max-height: 500px"
          :data="chartData"
          :options="{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                  drawTicks: false,
                },
                ticks: {
                  display: false,
                },
              },
              y: {
                border: {
                  display: false,
                },
                grid: {
                  display: false,
                  drawBorder: false,
                  drawTicks: false,
                },
                ticks: {
                  display: false,
                },
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

const prcEngagedUsers = ref();
const analyticsDataEngagedUsers = ref(null);
const error = ref(null);
const headers = ref([]);
const values = ref([]);

// Fetch total users
const fetchPrcEngagedUsers = async () => {
  error.value = null;

  try {
    const response = await axios.get( domains + '/api/get-analytics-data', {
      params: {
        'metrics[name]': 'engagementRate',
        'rangeType': 'year'
      },
    });

    prcEngagedUsers.value = response.data.values.values[0];
  } catch (err) {
    error.value = 'Failed to fetch analytics data';
    console.error(err);
  }
};

// Fetch total users per month
const fetchPrcEngagedUsersPerMonth = async () => {
  error.value = null;

  try {
    const response = await axios.get( domains + '/api/get-analytics-data', {
      params: {
        'metrics[name]': 'engagementRate',
        'dimensions[name]': 'month',
        'rangeType': 'year'
      },
    });

    analyticsDataEngagedUsers.value = response.data.values;
    headers.value = analyticsDataEngagedUsers.value.headers;
    values.value = analyticsDataEngagedUsers.value.values;

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
function convertToPercentages(values) {
  return values.map(value => `${parseFloat(value) * 100}%`);
}


onMounted(() => {
    fetchPrcEngagedUsers();
    fetchPrcEngagedUsersPerMonth();
});

const chartData = computed(() => {
  if (analyticsDataEngagedUsers.value) {
    const formattedMonths = formatMonth(headers.value);
    return {
            labels: formattedMonths,
            datasets: [
              {
                label: 'Engaged Sessions',
                backgroundColor: 'rgba(255,255,255,.2)',
                borderColor: 'rgba(255,255,255,.55)',
                data: values.value,
                barPercentage: 0.6,
              },
            ],
          };
  }
  return {};
});
</script>