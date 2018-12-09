const { TwoFactor } = require( '../lib' );

const testFunction = async () => {

    const apiInstance = new TwoFactor( 'Your API Key' );

    try {

        const response = await apiInstance.OTP.verifyOtp( {
            otp: '123456',
            sessionId: 'some-guid-here'
            // deliveryType: apiInstance.DeliveryTypes.voice
        } );

        console.log( response );

    } catch (error) {
        console.log( 'Error: ', error );
    }

};

testFunction();
