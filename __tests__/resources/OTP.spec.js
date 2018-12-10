const test = require( 'tape' );

const { TwoFactor, Fixtures, mocker } = require( '../fixtures' );

// --------------------------
// .sendOtp(...)
// --------------------------

test( 'throw an error when the parameter envelope is false', t => {

    t.throws( () => {
        TwoFactor.OTP.sendOtp()
    }, Error );

    t.throws( () => {
        TwoFactor.OTP.sendOtp( null )
    }, Error );

    t.end();

} );


test( 'throw an error when the parameter envelope is nor an object or string', t => {

    t.throws( () => {
        TwoFactor.OTP.sendOtp( 1234 )
    }, TypeError );

    t.throws( () => {
        TwoFactor.OTP.sendOtp( () => {} );
    }, TypeError );

    t.throws( () => {
        TwoFactor.OTP.sendOtp( [] );
    }, Error );

    t.end();

} );

test( 'throw an error if required parameters are falsy', t => {

    t.throws( () => {
        TwoFactor.OTP.sendOtp( {} );
    }, Error );

    t.throws( () => {
        TwoFactor.OTP.sendOtp( { phoneNumber: 1234567890 } );
    }, TypeError );

    t.throws( () => {
        TwoFactor.OTP.sendOtp( { phoneNumber: true } );
    }, TypeError );

    t.throws( () => {
        TwoFactor.OTP.sendOtp( { phoneNumber: [] } );
    }, TypeError );

    t.throws( () => {
        TwoFactor.OTP.sendOtp( { phoneNumber: {} } );
    }, TypeError );

    t.end();

} );

test( 'throw an error when the otpType is custom and the OTP is not provided', t => {

    t.throws( () => {
        TwoFactor.OTP.sendOtp( { phoneNumber: '1234567890', otpType: TwoFactor.OTP.OtpTypes.custom } );
    }, Error );

    t.throws( () => {
        TwoFactor.OTP.sendOtp(
            { phoneNumber: '1234567890', otpType: TwoFactor.OTP.OtpTypes.custom, otp: [] }
        );
    }, TypeError );

    t.end();

} );

test( 'sends the correct request to send an OTP on a string param', async t => {

    const phoneNumber = 'XXXXXXXXXX';

    mocker.mock( {
        subPath: `SMS/${ phoneNumber }/AUTOGEN`
    } );

    try {

        const response = await TwoFactor.OTP.sendOtp( phoneNumber );

        t.equal( typeof response.__MOCKED_RESPONSE_DATA__, 'object' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, 'c59103dd-fa46-11e8-a895-0200cd936042' );
        t.end();

    } catch ( error ) { throw error; }

} );

test( 'sends the correct request to send an OTP', async t => {

    const phoneNumber = 'XXXXXXXXXX';
    const otp = '123456';

    mocker.mock( {
        subPath: `SMS/${ phoneNumber }/AUTOGEN`
    } );

    try {

        let response = await TwoFactor.OTP.sendOtp( { phoneNumber } );

        t.equal( typeof response.__MOCKED_RESPONSE_DATA__, 'object' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, 'c59103dd-fa46-11e8-a895-0200cd936042' );

        mocker.mock( {
            subPath: `SMS/${ phoneNumber }/${ otp }`
        } );

        response = await TwoFactor.OTP.sendOtp( {
            phoneNumber,
            otpType: TwoFactor.OTP.OtpTypes.custom,
            otp
        } );

        t.equal( typeof response.__MOCKED_RESPONSE_DATA__, 'object' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, 'c59103dd-fa46-11e8-a895-0200cd936042' );

        t.end();

    } catch ( error ) { throw error; }

} );

test( 'sends the correct request to send an OTP via a voice call', async t => {

    const phoneNumber = 'XXXXXXXXXX';
    const otp = '123456';

    mocker.mock( {
        subPath: `VOICE/${ phoneNumber }/AUTOGEN`
    } );

    try {

        let response = await TwoFactor.OTP.sendOtp( {
            phoneNumber,
            deliveryType: TwoFactor.OTP.DeliveryTypes.voice
        } );

        t.equal( typeof response.__MOCKED_RESPONSE_DATA__, 'object' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, 'c59103dd-fa46-11e8-a895-0200cd936042' );

        mocker.mock( {
            subPath: `VOICE/${ phoneNumber }/${ otp }`
        } );

        response = await TwoFactor.OTP.sendOtp( {
            phoneNumber,
            otpType: TwoFactor.OTP.OtpTypes.custom,
            otp,
            deliveryType: TwoFactor.OTP.DeliveryTypes.voice
        } );

        t.equal( typeof response.__MOCKED_RESPONSE_DATA__, 'object' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, 'c59103dd-fa46-11e8-a895-0200cd936042' );

        t.end();

    } catch ( error ) { throw error; }

} );

// --------------------------
// .verifyOtp(...)
// --------------------------

test( 'throw an error when the parameter envelope is falsy', t => {

    t.throws( () => {
        TwoFactor.OTP.verifyOtp()
    }, Error );

    t.throws( () => {
        TwoFactor.OTP.verifyOtp( null )
    }, Error );

    t.throws( () => {
        TwoFactor.OTP.verifyOtp( [] )
    }, Error );

    t.end();

} );

test( 'throw an error if required parameters are falsy', t => {

    t.throws( () => {
        TwoFactor.OTP.verifyOtp( {} );
    }, Error );

    t.throws( () => {
        TwoFactor.OTP.verifyOtp( { otp: null } );
    }, Error );

    t.throws( () => {
        TwoFactor.OTP.verifyOtp( { otp: true } );
    }, TypeError );

    t.throws( () => {
        TwoFactor.OTP.verifyOtp( { otp: [] } );
    }, TypeError );

    t.throws( () => {
        TwoFactor.OTP.verifyOtp( { otp: {} } );
    }, TypeError );

    t.throws( () => {
        TwoFactor.OTP.verifyOtp( { otp: '123456' } );
    }, Error );

    t.throws( () => {
        TwoFactor.OTP.verifyOtp( { otp: '123456', sessionId: null } );
    }, Error );

    t.throws( () => {
        TwoFactor.OTP.verifyOtp( { otp: '123456', sessionId: true } );
    }, Error );

    t.throws( () => {
        TwoFactor.OTP.verifyOtp( { otp: '123456', sessionId: '1234567890' } );
    }, TypeError );

    t.end();

} );

test( 'sends the correct request to verify an OTP', async t => {

    const sessionId = 'c59103dd-fa46-11e8-a895-0200cd936042';
    const otp = '123456';

    mocker.mock( {
        subPath: `SMS/VERIFY/${ sessionId }/${ otp }`,
        responseType: 'otpMatched'
    } );

    try {

        let response = await TwoFactor.OTP.verifyOtp( { otp, sessionId } );

        t.equal( typeof response.__MOCKED_RESPONSE_DATA__, 'object' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, 'OTP Matched' );

        mocker.mock( {
            subPath: `SMS/VERIFY/${ sessionId }/${ otp }`,
            responseType: 'otpMatched'
        } );

        response = await TwoFactor.OTP.verifyOtp( {
            sessionId,
            otp,
            otpType: TwoFactor.OTP.OtpTypes.custom
        } );

        t.equal( typeof response.__MOCKED_RESPONSE_DATA__, 'object' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, 'OTP Matched' );

        t.end();

    } catch ( error ) { throw error; }

} );

test( 'sends the correct request to verify an OTP via a voice call', async t => {

    const sessionId = 'c59103dd-fa46-11e8-a895-0200cd936042';
    const otp = '123456';

    mocker.mock( {
        subPath: `VOICE/VERIFY/${ sessionId }/${ otp }`,
        responseType: 'otpMatched'
    } );

    try {

        let response = await TwoFactor.OTP.verifyOtp( {
            otp,
            sessionId,
            deliveryType: TwoFactor.OTP.DeliveryTypes.voice
        } );

        t.equal( typeof response.__MOCKED_RESPONSE_DATA__, 'object' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, 'OTP Matched' );

        mocker.mock( {
            subPath: `VOICE/VERIFY/${ sessionId }/${ otp }`,
            responseType: 'otpMatched'
        } );

        response = await TwoFactor.OTP.verifyOtp( {
            otp,
            sessionId,
            deliveryType: TwoFactor.OTP.DeliveryTypes.voice
        } );

        t.equal( typeof response.__MOCKED_RESPONSE_DATA__, 'object' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, 'OTP Matched' );

        t.end();

    } catch ( error ) { throw error; }

} );
