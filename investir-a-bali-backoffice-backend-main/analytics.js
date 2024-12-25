const { google } = require("googleapis");


// Function to calculate date range from one month ago to today
function getDateRangeOneMonth() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
  
    const startDate = oneMonthAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    
    return { startDate, endDate };
}

// Function to calculate date range from one year ago to today
function getDateRangeOneYear() {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
  
    const startDate = oneYearAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    
    return { startDate, endDate };
}


async function getAnalyticsData(metrics, dimensions, dateRanges, rangeType = 'month') {
    const auth = new google.auth.GoogleAuth({
        keyFile: "./service-account.json", // Replace with the path to your service account JSON file
        scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const analytics = google.analyticsdata({
        version: "v1beta",
        auth: auth,
    });

    // Determine the date range based on rangeType
    let dateRange;
    if (dateRanges) {
        dateRange = dateRanges;
    } else {
        dateRange = rangeType === 'year' ? getDateRangeOneYear() : getDateRangeOneMonth();
    }
    
    const formattedDateRanges = [{ startDate: dateRange.startDate, endDate: dateRange.endDate }];

    try {
        const response = await analytics.properties.runReport({
            property: "properties/461143229", // Replace with your Google Analytics property ID
            requestBody: {
                dimensions,
                metrics,
                dateRanges: formattedDateRanges,
            },
        });

        return { ...dataFormatter(response.data), values: ChartFormatter(dataFormatter(response.data).values) };
    } catch (error) {
        console.error("Error fetching analytics data:", error);
        throw error;
    }
}

  

module.exports = { getAnalyticsData };

const dataFormatter = (data) => {
    const result = {
      metrics: data.metricHeaders[0].name,
      values: data.rows.map((item) => {
        if (data.dimensionHeaders) {
          return { [item.dimensionValues[0].value]: item.metricValues[0].value };
        } else {
          return { total: item.metricValues[0].value };
        }
      }),
      rowCount: data.rowCount,
    };
  
    if (data.dimensionHeaders) {
      result.dimensions = data.dimensionHeaders[0].name;
    }
  
    return result;
  };
  

const ChartFormatter = (data) => {
  const headers = [];
  const values = [];
  for (const item of data) {
    const key = Object.keys(item)[0];
    const value = item[key];
    headers.push(key);
    values.push(value);
  }
  return { headers, values };
};
