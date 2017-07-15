let apiCall2 = function (apiUrl, params, headers, callback) {
  // try...catch allows you to handle errors 

  try {

    let dataFromCache = cache.get(apiUrl);
    console.log("key: "+apiUrl);
    let response = {};

    if(dataFromCache) {
      console.log("Data from Cache2...");
      response = dataFromCache;
    } else {
      console.log("Data from API2...");
        if (params, headers) {
          response = HTTP.get(apiUrl, {params: params, headers: headers}).data;
        }
        else {
          response = HTTP.get(apiUrl).data;
        }
      cache.set(apiUrl, response);
    }

    // A successful API call returns no error
    // but the contents from the JSON response
    if(callback) {
      callback(null, response);
    }
    return response;
  } catch (error) {
    // If the API responded with an error message and a payload 
    
    if (error.response) {
      console.log(error.response);
    // Otherwise use a generic error message
    } else {
    
    }
  }
};