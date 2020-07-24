const fetch = require('node-fetch');

const controller = {};

async function update(data, api, retryCount) {
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
