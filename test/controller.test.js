const expect = require('chai').expect;
const nock = require('nock');

const controller = require('../controller');

const NOCK_URL = 'http://locahost:8080';

describe('app.controller.js tests', () => {

  describe('updateRemoteApi() success', () => {
    beforeEach(() => {
      nock(NOCK_URL).put('/api/resource1').reply(200);
      nock(NOCK_URL).put('/api/resource2').reply(200);
    });

    it('updateRemoteApi', async () => {
      try {
        const data1 = 'new1';
        const api1 = `${NOCK_URL}/api/resource1`;
        const data2 = 'new2';
        const api2 = `${NOCK_URL}/api/resource2`;
        await controller.updateRemoteApi(data1, api1, data2, api2);
      } catch (error) {}
    });
  });

  describe('updateRemoteApi() fail on first update', () => {
    beforeEach(() => {
      nock(NOCK_URL).put('/api/resource1').replyWithError(500);
    });

    it('updateRemoteApi', async () => {
      try {
        const data1 = 'new1';
        const api1 = `${NOCK_URL}/api/resource1`;
        const data2 = 'new2';
        const api2 = `${NOCK_URL}/api/resource2`;
        await controller.updateRemoteApi(data1, api1, data2, api2);
      } catch (error) {
        expect(error);
      }
    });
  });

  describe('updateRemoteApi() fail on second update', () => {
    beforeEach(() => {
      nock(NOCK_URL).put('/api/resource1').reply(200);
      nock(NOCK_URL).put('/api/resource2').replyWithError(500);
    });

    it('updateRemoteApi', async () => {
      try {
        const data1 = 'new1';
        const api1 = `${NOCK_URL}/api/resource1`;
        const data2 = 'new2';
        const api2 = `${NOCK_URL}/api/resource2`;
        await controller.updateRemoteApi(data1, api1, data2, api2);
      } catch (error) {
        expect(error);
      }
    });
  });
});
