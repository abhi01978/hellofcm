// const express = require('express');
// const bodyParser = require('body-parser');
// const admin = require('firebase-admin');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Firebase Admin SDK initialization
// const serviceAccount = require('./serviceAccountKey.json'); // Update the path

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// app.use(bodyParser.json());
// app.use(express.static('public'));



// app.post('/send-notification', (req, res) => {
//     console.log('Received request:', req.body);
//     const { title, body, token } = req.body;
//     if (!title || !body || !token) {
//         console.error('Missing title, body, or token');
//         return res.status(400).send('Missing required fields');
//     }

//     const message = {
//         notification: {
//             title: title,
//             body: body,
//         },
//         token: token,
//     };

//     admin.messaging().send(message)
//         .then((response) => {
//             console.log('Successfully sent message:', response);
//             res.status(200).send('Notification sent successfully');
//         })
//         .catch((error) => {
//             console.error('Error sending message:', error);
//             res.status(500).send('Error sending notification');
//         });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


// const express = require('express');
// const bodyParser = require('body-parser');
// const admin = require('firebase-admin');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Firebase Admin SDK initialization
// const serviceAccount = require('./serviceAccountKey.json'); // Update the path

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// app.use(bodyParser.json());
// app.use(express.static('public'));

// // Array to store device tokens
// let deviceTokens = [];

// // Endpoint to register device token
// app.post('/register-token', (req, res) => {
//     const { token } = req.body;
//     if (!token) {
//         return res.status(400).send('Token is required');
//     }
//     // Store the token in the array (you can also use a database)
//     if (!deviceTokens.includes(token)) {
//         deviceTokens.push(token);
//     }
//     res.status(200).send('Token registered successfully');
// });

// // Endpoint to send notification
// app.post('/send-notification', (req, res) => {
//     const { title, body } = req.body;
//     if (!title || !body) {
//         return res.status(400).send('Missing title or body');
//     }

//     const message = {
//         notification: {
//             title: title,
//             body: body,
//         },
//         tokens: deviceTokens, // Send to all registered tokens
//     };

//     admin.messaging().sendMulticast(message)
//         .then((response) => {
//             console.log('Successfully sent message:', response);
//             res.status(200).send('Notification sent successfully');
//         })
//         .catch((error) => {
//             console.error('Error sending message:', error);
//             res.status(500).send('Error sending notification');
//         });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Firebase Admin SDK initialization
const serviceAccount = require('./serviceAccountKey.json'); // Update the path

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
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
    // Store the token in the array (you can also use a database)
    if (!deviceTokens.includes(token)) {
        deviceTokens.push(token);
    }
    res.status(200).send('Token registered successfully');
});

// Endpoint to send notification
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
            title: title,
            body: body,
        },
        tokens: deviceTokens, // Send to all registered tokens
    };

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log('Successfully sent message:', response);
        res.status(200).send('Notification sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Error sending notification');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
