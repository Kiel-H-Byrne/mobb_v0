var apiCall2 = function (apiUrl, params, headers, callback) {
  // try...catch allows you to handle errors 
  var errorCode, errorMessage;
  try {

    var dataFromCache = cache.get(apiUrl);
    console.log("key: "+apiUrl);
    var response = {};

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
      errorCode = error.response.data.error ? error.response.data.error.code : 1911;
      errorMessage = error.response.data.error ? error.response.data.error.message : error.response.data.message;
    // Otherwise use a generic error message
    } else {
      errorCode = 500;
      errorMessage = 'No idea what happened!';
    }
    // Create an Error object and return it via callback
    var myError = new Meteor.Error(errorCode, errorMessage);
    let msg = 'Error: [' + errorCode + '] ' + errorMessage ;
    Errors.insert({message: msg});
    if(callback) {
      callback(myError, null);
    }
    return myError;
  }
};



({
  getYelpID: function(phone) {
    this.unblock();
    var quotesUrl = "https://api.yelp.com/v3/businesses/search/phone";
    var quotesParams = {
      phone: phone
    };
    const access_token = 'BAYaQkXitLcxtW-pKp3w6p8pEMVZYv7FF5FTEUJVrtJWbtVt5YQ9k80EgQ3bVv2eJr-Hh4xXh_uG0xWmf4hYKKM4Wy-cFrz8b803Xfi--USK3Em78pgQTr9hYT1nWHYx';
    var quotesHeaders = {
      'Authorization': 'Bearer '+ access_token
    };
    var response = Meteor.wrapAsync(apiCall2)(quotesUrl, quotesParams,quotesHeaders);
    //console.log("ending get news ticker feed {}", response);

    return response;
  }, 
})