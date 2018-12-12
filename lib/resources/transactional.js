const path = require( 'path' );
const ApiBase = require( '../base' );
const Utils = require( '../utils' );

const { SchemaValidator } = Utils;

const sendMessageValidator = new SchemaValidator( path.join( __dirname, '../schema/send-message.json' ) );

class Transactional extends ApiBase {

    constructor( apiKey ) {

        super( apiKey );

        this.TemplateTypes = { dynamic: 'dynamic', open: 'open' };

    }

    getBalance() {

        return this._request.get( {
            url: '/ADDON_SERVICES/BAL/TRANSACTIONAL_SMS'
        } );

    }

    sendMessage( parameters ) {

        sendMessageValidator.validateAndThrow( parameters );

        const defaults = {
            templateType: this.TemplateTypes.dynamic
        };

        const compositeParameters = Object.assign( defaults, parameters );
        sendMessageValidator.validateAndThrow( compositeParameters );

        const {
            templateType,
            from,
            message,
            sendAt,
            templateName
        } = compositeParameters;

        let { to } = compositeParameters;
        to = ( typeof to === 'string' ) ? to : to.join( ',' );

        const url = '/ADDON_SERVICES/SEND/TSMS';

        if ( templateType === this.TemplateTypes.open ) {

            return this._request.post( {
                url,
                formData: {
                    From: from,
                    To: to,
                    Msg: message,
                    SendAt: sendAt
                }
            } );

        }

        const vars = Object.keys( compositeParameters )
            .filter( key => key.substring( 0, 3 ) === 'var' )
            .reduce( ( acc, current ) => {

                acc[ current.toUpperCase() ] = compositeParameters[ current ];
                return acc;

            }, {} );

        return this._request.post( {
            url,
            formData: {
                From: from,
                To: to,
                TemplateName: templateName,
                ...vars
            }
        } );

    }

}

module.exports = Transactional;
