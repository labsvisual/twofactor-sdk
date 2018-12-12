const nock = require( 'nock' );
const Fixtures = require( './fixtures' );

class Mocker {

    constructor() {

        this.apiEndpoint = 'https://2factor.in/API/V1/d3aa88e2-c754-41e0-8ba6-4198a34aa0a2';

    }

    processMultipart( data ) {

        let counter = 1;
        let oldKey = '';

        const dataParts = data.split( '\r\n' ).filter( part => part )
            .filter( part => part.substring( 0, 5 ) !== '-----' )
            .reduce( ( acc, current ) => {

                if ( counter % 2 === 0 ) {

                    acc[ oldKey ] = current;

                } else {

                    oldKey = current.split( ';' )[ 1 ].trim().split( '=' )[ 1 ].replace( /"/g, '' );
                    acc[ oldKey ] = '';

                }

                counter++;

                return acc;

            }, {} );

        return dataParts;

    }

    mock( mockingParameters ) {

        const defaults = {
            method: 'GET',
            requestBody: '',
            isError: false,
            responseType: 'otpSent'
        };

        const params = Object.assign( defaults, mockingParameters );

        if ( typeof params.subPath === 'undefined' || !params.subPath || typeof params.subPath !== 'string' ) {

            throw new Error( 'A resource base path is required for mocking the HTTP request.' );

        }

        const statusCode = ( params.isError && 400 ) || 200;

        return nock( this.apiEndpoint )
            .intercept( `/${ params.subPath }`, params.method )
            .reply( statusCode, ( uri, requestBody ) => {

                if ( params.isError ) {

                    switch ( params.errorType ) {

                        case 'apiKey':
                            return Fixtures.errors.apiKeyError;

                        case 'sessionIdError':
                            return Fixtures.errors.verifyError;

                        case 'otp':
                        default:
                            return Fixtures.errors.verifyError;

                    }

                }

                let responseBody = {};
                switch ( params.responseType ) {

                    case 'transactionalMessage':
                        responseBody = Fixtures.responses.transactionalMessage;
                        break;

                    case 'transactionalBalance':
                        responseBody = Fixtures.responses.transactionalBalance;
                        break;

                    case 'otpSent':
                        responseBody = Fixtures.responses.otpSent;
                        break;

                    default:
                    case 'otpMatched':
                        responseBody = Fixtures.responses.otpMatched;

                }

                return {
                    __MOCKED_RESPONSE_DATA__: {
                        ...responseBody
                    },
                    requestParameters: {
                        uri,
                        requestBody: this.processMultipart( requestBody )
                    }
                };

            } );

    }

}

module.exports = Mocker;
