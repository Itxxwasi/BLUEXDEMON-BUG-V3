const FormData = require('form-data');  // Importing the FormData module to handle form data
const Jimp = require('jimp');  // Importing Jimp for image processing

// Function that processes an image by enhancing it
async function remini(imageBuffer, actionType) {
  return new Promise(async (resolve, reject) => {
    // Default actions for image enhancement
    const validActions = ['enhance', 'recolor', 'dehaze']; 
    // If actionType is not in validActions, default it to 'enhance'
    actionType = validActions.includes(actionType) ? actionType : 'enhance';

    let formData = new FormData();  // Create a new FormData object
    let imageUrl = 'https://some-api.ai/';  // URL for the API endpoint
    imageUrl += `/${actionType}`;  // Append the action type to the URL

    // Append form data: key 'image' and image data (converted from buffer)
    formData.append('image', Buffer.from(imageBuffer), {
      filename: 'enhance_image_body.jpg',
      contentType: 'image/jpeg',
    });

    // Send a POST request with form data
    formData.submit({
      url: imageUrl,  // API URL
      host: 'inferenceengine.some-domain.com',  // Host for the API
      path: `/${actionType}`,  // Path based on action type
      protocol: 'https:',  // Protocol to use
      headers: {
        'User-Agent': 'okhttp/4.9.3',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',  // Gzip compression
      },
    }, (error, response) => {
      // Callback function to handle response

      if (error) {
        reject(error);  // Reject the promise if there is an error
      } else {
        let dataChunks = [];  // Array to store data chunks

        // Collect data chunks
        response.on('data', (chunk) => {
          dataChunks.push(chunk);
        });

        // When the response ends, resolve the promise with the data
        response.on('end', () => {
          resolve(Buffer.concat(dataChunks));
        });

        // If an error occurs during data reception, reject the promise
        response.on('error', (err) => {
          reject(err);
        });
      }
    });
  });
}

// Export the function for use elsewhere
module.exports.remini = remini;
