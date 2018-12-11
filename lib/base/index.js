const Request = require( 'request-promise-native' );

const Utils = require( '../utils' );

class ApiBase {

    constructor( apiKey ) {

        if ( typeof apiKey === 'undefined' || !apiKey ) {

            throw new Error( 'The API Key is required to initialize a new instance.' );

        }

        if ( typeof apiKey !== 'string' ) {

            throw new TypeError( `API Key: was expecting a string, got ${ typeof apiKey }` );

        }

        if ( !Utils.isGuidValid( apiKey ) ) {

            throw new TypeError( 'API Key: invalid API key, enter the correct API key' );

        }

        this._request = Request.defaults( {
            baseUrl: `https://2factor.in/API/V1/${ apiKey }`,
            json: true
        } );

    }

}

module.exports = ApiBase;
