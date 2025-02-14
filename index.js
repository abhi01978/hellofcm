const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(bodyParser.json());
app.use(express.static('public'));

// Array to store device tokens
let deviceTokens = [];

// Endpoint to register device token
app.post('/register-token', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).send('Token is required');
    }
    if (!deviceTokens.includes(token)) {
        deviceTokens.push(token);
    }
    console.log("Registered Tokens:", deviceTokens);
    res.status(200).send('Token registered successfully');
});

// ✅ Fix: Use `sendEachForMulticast()`
app.post('/send-notification', async (req, res) => {
    const { title, body } = req.body;
    if (!title || !body) {
        return res.status(400).send('Missing title or body');
    }

    if (deviceTokens.length === 0) {
        return res.status(400).send('No registered tokens found');
    }

    const message = {
        notification: {
            title,
            body,
        },
        tokens: deviceTokens, // Send to all registered tokens
    };

    try {
        const messaging = admin.messaging();
        
        // ✅ Correct Method for Firebase Admin SDK v10+
        const response = await messaging.sendEachForMulticast(message);

        console.log('Successfully sent message:', response);
        res.status(200).json({ message: "Notification sent successfully", response });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
