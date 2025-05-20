const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { emailValue, nameValue, messageValue, dateValue, budgetValue } = req.body.message;

  if (!emailValue || !nameValue) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_API_KEY}/sendMessage`;

  const payload = {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: `New message from ${nameValue} (${emailValue}) via DJKaset: ${messageValue || 'unspecified'}, Date of the event: ${dateValue || 'unspecified'}, Budget: ${budgetValue || 'unspecified'}`,
  };

  try {
    await axios.post(telegramApiUrl, payload, { timeout: 8000 });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
};
