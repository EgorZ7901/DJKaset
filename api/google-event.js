const axios = require('axios');

const { MEASUREMENT_ID, API_SECRET } = process.env;

async function trackEvent({ clientId, name, params = {} }) {
  console.log('trackEvent', clientId, name, params);

  try {
    await axios.post(
      `https://www.google-analytics.com/mp/collect`,
      {
        client_id: clientId,
        events: [
          {
            name,
            params
          }
        ]
      },
      {
        params: {
          measurement_id: MEASUREMENT_ID,
          api_secret: API_SECRET
        }
      }
    );
  } catch (e) {
    console.error('GA4 track error:', e.response?.data || e.message);
  }
}

module.exports = { trackEvent };