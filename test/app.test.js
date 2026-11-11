import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';

import app from '../app.js';

let server;
let baseUrl;

before(async () => {
    server = app.listen(0);

    await new Promise(resolve => {
        server.once('listening', resolve);
    });

    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close(error => {
            if (error) reject(error);
            else resolve();
        });
    });
});

test('Homepage should return 200', async () => {
    const response = await fetch(baseUrl);

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.equal(data.msg, 'Hello from Docker!');
});

test('Health endpoint should return 200', async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.equal(data.status, 'ok');
});

test('Invalid route should return 404', async () => {
    const response = await fetch(`${baseUrl}/invalid`);

    assert.equal(response.status, 404);
});