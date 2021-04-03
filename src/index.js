/**
 * Created by claudio on 2021-03-08
 */

const fetch = require('cross-fetch');
const RgbRestError = require('./RgbRestError');

const apiPath = '/api/';

/**
 * RGB REST client class.
 */
class RgbRestClient {
    /**
     * RgbRestClient class constructor.
     * @param {object} [options]
     * @param {string} [options.network=testnet] Target Bitcoin blockchain network.
     * @param {string} [options.host=rgb.blockchainofthings.com] Host name (with optional port) of target RGB REST API server.
     * @param {boolean} [options.secure=true] Indicates whether a secure connection (HTTPS) should be used.
     * @param {string} [options.version=1.1] Version of RGB REST API to target.
     */
    constructor(options) {
        options = options || {};

        this.network = typeof options.network === 'string' && options.network.length > 0 ? options.network : 'testnet';

        let host = typeof options.host === 'string' && options.host.length > 0 ? options.host : 'rgb.blockchainofthings.com';
        let secure = typeof options.secure === 'boolean' ? options.secure : true;
        let version = typeof options.version === 'string' && options.version.length > 0 ? options.version : '1.1';
        let uriPrefix = (secure ? 'https://' : 'http://') + host;
        let apiBaseUriPath = apiPath + version + '/';

        this.rootApiEndPoint = uriPrefix + apiBaseUriPath;
    }

    /**
     * Issue new fungible RGB asset.
     * @param {string} ticker
     * @param {string} name
     * @param {string} precision
     * @param {object|object[]} allocations
     * @param {object} [options]
     * @param {string} [options.description]
     * @param {object[]} [options.inflation]
     * @param {string[]} [options.renomination]
     * @param {string[]} [options.epoch]
     * @param {function} [callback]
     * @returns {(undefined|Promise)} Undefined if a callback function is passed. Otherwise, a promise that resolves
     *  to an asset info object.
     */
    issueFungible(ticker, name, precision, allocations, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = undefined;
        }

        options = options || {};

        let data = {
            ticker,
            name,
            precision,
            allocations
        };

        if (options.description) {
            data.description = options.description;
        }

        if (options.inflation) {
            data.inflation = options.inflation;
        }

        if (options.renomination) {
            data.renomination = options.renomination;
        }

        if (options.epoch) {
            data.epoch = options.epoch;
        }

        return this._request(
            'POST',
            ':network/fungible/issue',
            {
                url: {
                    network: this.network
                }
            },
            data,
            callback
        );
    }

    /**
     * Retrieve unspent Bitcoin transaction outputs (UTXOs) managed by a wallet.
     * @param {string} walletDescriptor
     * @param {object} [options]
     * @param {number} [options.keyRangeStartIdx]
     * @param {number} [options.keyRangeCount]
     * @param {function} [callback]
     * @returns {(undefined|Promise)} Undefined if a callback function is passed. Otherwise, a promise that resolves
     *  to an array of UTXOs.
     */
    walletUtxos(walletDescriptor, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = undefined;
        }

        options = options || {};

        const queryParams = {
            walletDescriptor
        };

        if (options.keyRangeStartIdx !== undefined) {
            queryParams.keyRangeStartIdx = options.keyRangeStartIdx;
        }

        if (options.keyRangeCount !== undefined) {
            queryParams.keyRangeCount = options.keyRangeCount;
        }

        return this._request(
            'GET',
            ':network/wallet/utxos',
            {
                url: {
                    network: this.network
                },
                query: queryParams
            },
            callback
        );
    }

    _request(method, methodPath, params, data, callback) {
        if (typeof params === 'function') {
            callback = params;
            params = data = undefined;
        }
        else if (typeof data === 'function') {
            callback = data;
            data = undefined;
        }

        let result;

        // Prepare promise to be returned if no callback passed
        if (typeof callback !== 'function') {
            result = new Promise((resolve, reject) => {
                callback = (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                }
            });
        }

        if (method === 'POST') {
            this._postRequest(methodPath, params, data)
            .then(body => callback(null, parseSuccessResponse(body)))
            .catch(err => callback(err));
        }
        else if (method === 'GET') {
            this._getRequest(methodPath, params)
            .then(body => callback(null, parseSuccessResponse(body)))
            .catch(err => callback(err));
        }

        return result;
    }

    async _getRequest(methodPath, params) {
        const url = this._assembleMethodEndPointUrl(methodPath, params);
        const headers = new fetch.Headers();
        headers.append('Content-Type','application/json; charset=utf-8');

        let init = {
            method: 'GET',
            headers
        };

        let res;

        try {
            res = await fetch(url, init);
        }
        catch (err) {
            throw new Error('Error calling GET request: ' + err.toString());
        }

        let body;

        try {
            body = await res.json();
        }
        catch (err) {
            throw new Error('Error reading GET request response: ' + err.toString());
        }

        if (!res.ok) {
            throw new RgbRestError(res.statusText, res.status, typeof body === 'object' && body.message ? body.message : undefined);
        }

        return body;
    }

    async _postRequest(methodPath, params, data) {
        const url = this._assembleMethodEndPointUrl(methodPath, params);
        const headers = new fetch.Headers();
        headers.append('Content-Type','application/json; charset=utf-8');

        let init = {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        };

        let res;

        try {
            res = await fetch(url, init);
        }
        catch (err) {
            throw new Error('Error calling POST request: ' + err.toString());
        }

        let body;

        try {
            body = await res.json();
        }
        catch (err) {
            throw new Error('Error reading POST request response: ' + err.toString());
        }

        if (!res.ok) {
            throw new RgbRestError(res.statusText, res.status, typeof body === 'object' && body.message ? body.message : undefined);
        }

        return body;
    }

    _assembleMethodEndPointUrl(methodPath, params) {
        // Make sure that duplicate slashes that might occur in the URL (due to empty URL parameters)
        //  are reduced to a single slash so the URL used for signing is not different from the
        //  actual URL of the sent request
        return this.rootApiEndPoint + formatMethodPath(methodPath, params).replace(/\/{2,}/g,'/');
    }

}

function formatMethodPath(methodPath, params) {
    let formattedMethodPath = methodPath;

    if (typeof params === 'object' && params !== null) {
        if (typeof params.url === 'object' && params.url !== null) {
            for (let urlParam in params.url) {
                if (params.url.hasOwnProperty(urlParam)) {
                    const re = new RegExp(':' + urlParam + '\\b');
                    formattedMethodPath = formattedMethodPath.replace(re, encodeURI(params.url[urlParam]));
                }
            }
        }

        if (typeof params.query === 'object' && params.query !== null) {
            let queryStr = '';
            for (let queryParam in params.query) {
                if (params.query.hasOwnProperty(queryParam)) {
                    if (queryStr.length > 0) {
                        queryStr += '&';
                    }
                    queryStr += encodeURI(queryParam) + '=' + encodeURI(params.query[queryParam]);
                }
            }
            if (queryStr.length > 0) {
                formattedMethodPath += '?' + queryStr;
            }
        }
    }

    return formattedMethodPath;
}

function parseSuccessResponse(body) {
    if (!(typeof body === 'object' && body !== null && typeof body.status === 'string' && body.status === 'success'
            && body.hasOwnProperty('data'))) {
        throw new Error('Inconsistent successful POST request response: ' + JSON.stringify(body));
    }

    return body.data;
}

module.exports = {
    RgbRestClient,
    RgbRestError
};
