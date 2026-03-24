// 备注：对应培训阶段 5（编译验证与问题修复），关联设计文档第 3 节“核心功能点”中的应用级接口验证。
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { createDependencies } from '../../src/server/app/createDependencies.js';
import { createApp } from '../../src/server/http/createApp.js';

const createTestServer = async () => {
  const tempDirectory = await mkdtemp(path.join(os.tmpdir(), 'snake-sprint-'));
  const dataFile = path.join(tempDirectory, 'leaderboard.json');
  const staticDir = path.join(process.cwd(), 'src', 'client');

  const dependencies = createDependencies({
    dataFile,
    createId: () => 'record-1',
    recordNow: () => '2026-03-24T10:00:00.000Z',
    healthNow: () => '2026-03-24T09:59:59.000Z'
  });

  const server = http.createServer(
    createApp({
      ...dependencies,
      staticDir
    })
  );

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    async close() {
      await new Promise((resolve) => server.close(resolve));
      await rm(tempDirectory, { recursive: true, force: true });
    }
  };
};

const requestJson = ({ url, method = 'GET', headers, body }) =>
  new Promise((resolve, reject) => {
    const request = http.request(
      url,
      {
        method,
        headers
      },
      (response) => {
        const chunks = [];

        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          try {
            resolve({
              status: response.statusCode ?? 0,
              body: JSON.parse(Buffer.concat(chunks).toString('utf8'))
            });
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    request.on('error', reject);

    if (body) {
      request.write(body);
    }

    request.end();
  });

const runHealthCheckTest = async () => {
  const harness = await createTestServer();

  try {
    const result = await requestJson({
      url: `${harness.baseUrl}/api/health`
    });

    assert.equal(result.status, 200);
    assert.equal(result.body.success, true);
    assert.equal(result.body.data.status, 'ok');
  } finally {
    await harness.close();
  }
};

const runScoreCrudTest = async () => {
  const harness = await createTestServer();

  try {
    const created = await requestJson({
      url: `${harness.baseUrl}/api/scores`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        playerName: 'Arisa',
        score: 80,
        durationMs: 8400
      })
    });

    const listed = await requestJson({
      url: `${harness.baseUrl}/api/scores?limit=5`
    });

    assert.equal(created.status, 201);
    assert.equal(created.body.data.id, 'record-1');
    assert.equal(listed.status, 200);
    assert.equal(listed.body.data[0].playerName, 'Arisa');
    assert.equal(listed.body.data[0].rank, 1);
  } finally {
    await harness.close();
  }
};

const runUnsupportedMediaTypeTest = async () => {
  const harness = await createTestServer();

  try {
    const result = await requestJson({
      url: `${harness.baseUrl}/api/scores`,
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'bad payload'
    });

    assert.equal(result.status, 415);
    assert.equal(result.body.error.code, 'UNSUPPORTED_MEDIA_TYPE');
  } finally {
    await harness.close();
  }
};

const main = async () => {
  await runHealthCheckTest();
  await runScoreCrudTest();
  await runUnsupportedMediaTypeTest();
  console.log('Integration checks passed.');
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
