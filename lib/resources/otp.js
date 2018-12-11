const path = require( 'path' );
const ApiBase = require( '../base' );
const Utils = require( '../utils' );
const { SchemaValidator } = require( '../utils' );

const sendOtpValidator = new SchemaValidator( path.join( __dirname, '../schema/otp-sendotp.json' ) );
const verifyOtpValidator = new SchemaValidator( path.join( __dirname, '../schema/otp-verifyotp.json' ) );

class OTP extends ApiBase {

    constructor( apiKey ) {

        super( apiKey );

        this.DeliveryTypes = { sms: 'SMS', voice: 'VOICE' };
        this.OtpTypes = { custom: 'custom', auto: 'AUTOGEN' };

    }

    sendOtp( parameters ) {

        parameters = ( typeof parameters === 'string' ) ? ( { phoneNumber: parameters } ) : parameters;

        const defaults = {
            phoneNumber: '',
            deliveryType: this.DeliveryTypes.sms,
            otpType: this.OtpTypes.auto
        };

        const compositeParameters = Object.assign( defaults, parameters );

        sendOtpValidator.validateAndThrow( compositeParameters );

        const {
            otp,
            deliveryType,
            otpType,
            phoneNumber,
            template
        } = compositeParameters;

        return this._request.get( {
            url: (
                `/${ deliveryType }/${ phoneNumber }/` +
                `${ ( otpType === this.OtpTypes.auto && 'AUTOGEN' ) || otp }` +
                `${ ( template && deliveryType === this.DeliveryTypes.sms && `/${ template }` ) || '' }`
            )
        } );

    }

    verifyOtp( parameters ) {

        const defaults = {
            deliveryType: this.DeliveryTypes.sms
        };

        const compositeParameters = Object.assign( defaults, parameters );

        verifyOtpValidator.validateAndThrow( compositeParameters );

        const {
            deliveryType,
            otp,
            sessionId
        } = compositeParameters;

        if ( !Utils.isGuidValid( sessionId ) ) {

            throw new TypeError( '"sessionId": the provided string is not a valid GUID' );

        }

        return this._request.get( {
            url: `/${ deliveryType }/VERIFY/${ sessionId }/${ otp }`
        } );

    }

}

module.exports = OTP;
