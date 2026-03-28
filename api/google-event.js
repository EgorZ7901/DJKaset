const { trackEvent } = require('./google-event');
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { emailValue, nameValue, messageValue, dateValue, songValue, clientId } = req.body.message;

  if (!emailValue || !nameValue) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_API_KEY}/sendMessage`;

  const payload = {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: `New message from ${nameValue} (${emailValue}) via DanceFirstThinkLater: ${messageValue}, Date of the event: ${dateValue}, Wedding song: ${songValue}`,
  };

  try {
    await axios.post(telegramApiUrl, payload, { timeout: 8000 });
    res.status(200).json({ success: true });
    await trackEvent({
      clientId,
      name: 'form_sent_successes',
      params: {
        form_name: 'dance_signup',
        method: 'api',
        email: emailValue,
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to send message' });
    await trackEvent({
      clientId,
      name: 'form_sent_error',
      params: {
        form_name: 'dance_signup',
        method: 'api',
        email: emailValue,
        error: error.message,
      }
    });
  }
};
