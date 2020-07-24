const fetch = require('node-fetch');

const controller = {};

/**
  Update a given API with specified data

    data        - data used to be sent over to the API
    api         - the URL to the API
    retryCount  - a number of retry before considered the request is FAILED

 */
async function update(data, api, retryCount=0) {
  try {
    const response = await fetch(api, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    if (retryCount > 0) {
      await update(data, api, retryCount - 1);
    } else {
      throw new Error('Failed to update');
    }
  }
}

/*
    Update two remote API's with specific request data

      data1   - data for the first request
      api1    - API url to the first request
      data2   - data for the second request
      api2    - API url to the second request
      onUndo  - a callback function in case the second request is FAILED to undo the first request

*/
controller.updateRemoteApi = async (data1, api1, data2, api2, onUndo) => {
  try {
    // first update
    await update(data1, api1, 2);
  } catch (error) {
    throw new Error('Failed on first update');
  }

  try {
    // second update
    await update(data2, api2, 2);
  } catch (error) {
    // undo the first update
    if (onUndo) {
      onUndo();
    }
    throw new Error('Failed on second update');
  }
};

module.exports = controller;
