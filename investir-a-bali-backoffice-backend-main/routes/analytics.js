const express = require('express');
const { getAnalyticsData } = require('../analytics'); // Adjust the path accordingly

const router = express.Router();

router.get('/api/get-analytics-data', async (req, res) => {
    try {
        const { metrics, dimensions, dateRanges, rangeType } = req.query;
        
        // Pass rangeType to control if you want 'month' or 'year'
        const data = await getAnalyticsData(metrics, dimensions, dateRanges, rangeType);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;
