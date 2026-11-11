import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.json({
        msg: 'Hello from Docker!'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'task-1'
    });
});

export default app;

