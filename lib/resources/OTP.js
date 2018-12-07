const ApiBase = require( '../base' );
const Utils = require( '../utils' );

class OTP extends ApiBase {

    constructor( apiKey ) {
        super( apiKey );

        this.DeliveryTypes = { sms: 'SMS', voice: 'VOICE' };
        this.OtpTypes = { custom: 'custom', auto: 'AUTOGEN' };
    }

    sendOtp( parameters ) {

        if ( typeof parameters === 'undefined' || !parameters ) {
            throw new Error( 'No parameter envelope was provided.' );
        }

        if (
            ( typeof parameters !== 'object' && !Array.isArray( parameters ) ) &&
            ( typeof parameters !== 'string' )
        ) {
            throw new TypeError(
                `"parameters": was expecting an object, got ${ typeof parameters }`
            );
        }

        const defaults = {
            phoneNumber: ( typeof parameters === 'string' ) ? parameters : '',
            deliveryType: this.DeliveryTypes.sms,
            otpType: this.OtpTypes.auto
        };

        const {
            otp,
            deliveryType,
            otpType,
            phoneNumber
        } = Object.assign( defaults, parameters );

        if ( typeof phoneNumber === 'undefined' || !phoneNumber ) {
            throw new Error( 'The "phoneNumber" is required to send a OTP.' );
        }

        if ( typeof phoneNumber !== 'string' ) {
            throw new TypeError(
                `"phoneNumber": was expecting a string, got ${ typeof phoneNumber }`
            );
        }

        if ( otpType === this.OtpTypes.custom && !otp ) {
            throw new Error(
                'The OTP type was set to custom but did not receive a OTP in the parameter envelope.'
            );
        }

        if ( otpType === this.OtpTypes.custom && typeof otp !== 'string' ) {
            throw new Error(
                `"otp": was expecting a string, got ${ typeof otp }`
            );
        }

        return this._request.get({
            url: `/${ deliveryType }/${ phoneNumber }/${ ( otpType === this.OtpTypes.auto && 'AUTOGEN' ) || otp }`
        });

    }

    verifyOtp( parameters ) {

        if ( typeof parameters === 'undefined' || !parameters ) {
            throw new Error( 'No parameter envelope was provided.' );
        }

        if ( typeof parameters !== 'object' && !Array.isArray( parameters ) ) {
            throw new TypeError(
                `"parameters": was expecting an object, got ${ typeof parameters }`
            );
        }

        const defaults = {
            deliveryType: this.DeliveryTypes.sms,
        };

        const {
            deliveryType,
            otp,
            sessionId
        } = Object.assign( defaults, parameters );

        if ( typeof otp === 'undefined' || !otp ) {
            throw new Error( 'The "otp" is required to verify a OTP.' );
        }

        if ( typeof otp !== 'string' ) {
            throw new TypeError(
                `"otp": was expecting a string, got ${ typeof phoneNumber }`
            );
        }

        if ( typeof sessionId === 'undefined' || !sessionId ) {
            throw new Error( 'The "sessionId" is required to verify a OTP.' );
        }

        if ( typeof sessionId !== 'string' ) {
            throw new TypeError(
                `"sessionId": was expecting a string, got ${ typeof phoneNumber }`
            );
        }

        if ( !Utils.isGuidValid( sessionId ) ) {
            throw new TypeError( `"sessionId": the provided string is not a valid GUID` );
        }

        return this._request.get({
            url: `/${ deliveryType }/VERIFY/${ sessionId }/${ otp }`
        });

    }

}

module.exports = OTP;
