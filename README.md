# RGB REST JavaScript Client

A JavaScript library used to consume the RGB REST API service provided by Blockchain of Things.

## Installation

On Node.js:

```shell
npm install rgb-rest-client
```

On the browser:

```html
<script src="https://unpkg.com/rgb-rest-client"></script>
```

### Browser compatibility

The RGB REST JavaScript Client library is compatible with modern web browsers.

It has been tested on the following web browsers:

- Safari ver. 14.0 (on macOS Big Sur 11.2)
- Google Chrome ver. 89.0 64 bits (on macOS Big Sur 11.2)
- Firefox ver. 86.0 64-bits (on macOS Big Sur 11.2)
- Microsoft Edge ver. 89.0 64 bits (on macOS Big Sur 11.2)

## Usage

### Instantiate the RGB REST client object.

On Node.js:

```javascript
const rgbRestClient = require('rgb-rest-client');

const rgb = new rgbRestClient.RgbRestClient();
```

On the browser:

```html
<script>
const rgb = new rgbRestClient.RgbRestClient();
</script>
```

#### Constructor options

The following options can be used when instantiating the RGB REST client object:

- **network** \[String\] - (optional, default: <b>*'testnet'*</b>) Target Bitcoin blockchain network. Valid values:
    - *'testnet'*
    - *'signet'*
- **host** \[String\] - (optional, default: <b>*'rgb.blockchainofthings.com'*</b>) Host name (with optional port) of target RGB REST API server.
- **secure** \[String\] - (optional, default: <b>*true*</b>) Indicates whether a secure connection (HTTPS) should be used.
- **version** \[String\] - (optional, default: <b>*'1.1'*</b>) Version of RGB REST API to target.

### Calling API methods

#### Issue Fungible Asset

Using a callback:

```javascript
rgb.issueFungible(
  'TST1',           // Ticker
  'Test asset #1',  // Name
  0,                // Precision
  {                 // Allocations
    coins:123,
    outpoint:'5c1cb187a0d80955f87d65e3b798b5975362aa5e6f48d99a293bf162606fbdaa:4'
  },
  {                 // Options
    description:'RGB asset used for testing RGB REST client'    // Description
  },
  (err, data) => {
    if (err) {
      console.error('Error issuing fungible RGB asset:', err);
    }
    else {
      console.log('Newly issued asset info:', data.assetInfo);
    }
  }
);
```

Using promise:

```javascript
rgb.issueFungible(
    'TST1',           // Ticker
    'Test asset #1',  // Name
    0,                // Precision
    {                 // Allocations
        coins:123,
        outpoint:'5c1cb187a0d80955f87d65e3b798b5975362aa5e6f48d99a293bf162606fbdaa:4'
    },
    {                 // Options
        description:'RGB asset used for testing RGB REST client'    // Description
    }
)
.then(data => {
    console.log('Newly issued asset info:', data.assetInfo);
})
.catch(err => {
    console.error('Error issuing fungible RGB asset:', err);
});
```

### Error handling

Two types of error can take place when calling API methods: client or API error.

Client errors return generic error objects.

API errors, on the other hand, return a custom **RgbRestError** object.

**RgbRestError** objects are extended from Javascript's standard *Error* object, so they share the same
characteristics with the following exceptions:

- The value of the *name* field is set to `RgbRestError`
- It has the following additional fields: *httpStatusMessage*, *httpStatusCode*, and *apiErrorMessage*

> **Note**: the *apiErrorMessage* field of the RgbRestError object contains the error message returned by the
RGB REST API service. However, there might be cases where that field is **undefined**.

Usage example:

```JavaScript
const rgbRestClient = require('rgb-rest-client');

const rgb = new rgbRestClient.RgbRestClient();

rgb.issueFungible(
    '',     // Ticker
    '',     // Name
    0,      // Precision
    [],
    (err, data) => {
        if (err) {
            if (err instanceof rgbRestClient.RgbRestError) {
                // RGB REST API error
                console.log('HTTP status code:', err.httpStatusCode);
                console.log('HTTP status message:', err.httpStatusMessage);
                console.log('API error message:', err.apiErrorMessage);
                console.log('Compiled error message:', err.message);
            }
            else {
                // Client error
                console.log(err);
            }
        }
        else {
            // Process returned data
        }
    }
);
```

Expected result:

```
HTTP status code: 400
HTTP status message: Bad Request
Catenis error message: Invalid parameters
Compiled error message: Error returned from RGB REST API endpoint: [400] Invalid parameters
```

## License

This JavaScript library is released under the [MIT License](LICENSE). Feel free to fork, and modify!

Copyright © 2021, Blockchain of Things Inc.
