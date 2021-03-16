/**
 * Created by claudio on 2021-03-08
 */

class RgbRestError extends Error {
    constructor(httpStatusMessage, httpStatusCode, apiErrorMessage) {
        super('Error returned from RGB REST API endpoint: [' + httpStatusCode + '] ' + (apiErrorMessage ? apiErrorMessage : httpStatusMessage));
        this.name = 'RgbRestError';
        this.httpStatusMessage = httpStatusMessage;
        this.httpStatusCode = httpStatusCode;
        this.apiErrorMessage = apiErrorMessage;
    }
}

module.exports = RgbRestError;