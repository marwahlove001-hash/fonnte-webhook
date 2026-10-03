const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let latestPinggyUrl = "Belum ada link tersimpan. Pastikan Muse AI sudah berjalan.";
const FONNTE_TOKEN = process.env.FONNTE_TOKEN; // Disimpan di Environment Variables Render

// Endpoint 1: Menerima update link terbaru dari Muse AI
app.post('/update-link', (req, res) => {
    const { url } = req.body;
    if (url) {
        latestPinggyUrl = url;
        console.log("Link Pinggy diperbarui dari Muse AI:", latestPinggyUrl);
        return res.status(200).send("Link updated successfully");
    }
    res.status(400).send("URL missing");
});

// Endpoint 2: Webhook untuk Fonnte saat Anda chat !link di WA
app.post('/webhook', async (req, res) => {
    const message = req.body.message || '';
    const sender = req.body.sender || '';

    if (message.toLowerCase().trim() === 'link' || message.toLowerCase().trim() === '!link') {
        const replyMsg = `🚀 *Link 9Router Terbaru:*\n\n*Dashboard:*\n${latestPinggyUrl}\n\n*Base URL IDE / Muse AI:*\n${latestPinggyUrl}/v1`;

        // Kirim balasan ke WhatsApp via API Fonnte
        try {
            await fetch('https://api.fonnte.com/send', {
                method: 'POST',
                headers: {
                    'Authorization': FONNTE_TOKEN,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'target': sender,
                    'message': replyMsg
                })
            });
        } catch (error) {
            console.error("Gagal mengirim ke Fonnte:", error);
        }
    }
    res.status(200).send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Webhook Render aktif di port ${PORT}`);
});
