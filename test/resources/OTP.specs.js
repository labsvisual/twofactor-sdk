const { expect } = require( 'chai' );

const { TwoFactor, Fixtures, mocker } = require( '../fixtures' );

describe( '# OTP', () => {

    describe( '## Generate', () => {

        describe( '### Parameter Envelope', () => {

            it( 'throws an error when no parameter object is provided', () => {

                expect( () => TwoFactor.OTP.sendOtp() ).to.throw( Error );

            } );

            const testCases = [ 12345, () => {}, [] ];
            for( const testCase of testCases ) {

                it( `throws an Error when the envelope is not an object: <${ typeof testCase }>`, () => {

                    expect( () => TwoFactor.OTP.sendOtp( testCase ) ).to.throw( Error );

                } );

            }

        } );

        it( 'throws an error when "phoneNumber" is not provided', () => {

            expect( () => TwoFactor.OTP.sendOtp( {} ) ).to.throw( Error );

        } );

        it( 'throws an error when "phoneNumber" is not a string', () => {

            expect( () => TwoFactor.OTP.sendOtp( { phoneNumber: 123 } ) ).to.throw( TypeError );

        } );

        it( 'throws an error when "otpType" is custom and OTP is not provided', () => {

            expect(
                () => TwoFactor.OTP.sendOtp( {
                    phoneNumber: '1234567890',
                    otpType: TwoFactor.OTP.OtpTypes.custom
                } )
            ).to.throw( Error );

        } );

        it( 'throws an error when "otpType" is custom and OTP is not a string', () => {

            expect(
                () => TwoFactor.OTP.sendOtp( {
                    phoneNumber: '1234567890',
                    otpType: TwoFactor.OTP.OtpTypes.custom,
                    otp: 12345
                } )
            ).to.throw( Error );

        } );

        it( 'forms and formats the GET request to generate an OTP correctly on string as parameter', async () => {

            const phoneNumber = '1234567890';

            mocker.mock( {
                subPath: `SMS/${ phoneNumber }/AUTOGEN`,
                responseType: 'otpSent'
            } );

            try {

                const response = await TwoFactor.OTP.sendOtp( phoneNumber );

                expect( response.__MOCKED_RESPONSE_DATA__.Status ).to.equal( 'Success' );
                expect( response.__MOCKED_RESPONSE_DATA__.Details ).to.match( Fixtures.guidRegexp );
                expect( response.requestParameters.uri ).to.include( `/SMS/${ phoneNumber }/AUTOGEN` );

            } catch ( error ) { throw error; }

        } );

        describe( '### SMS', () => {

            it( 'forms and formats the GET request to generate an OTP correctly <Auto>', async () => {

                const phoneNumber = '1234567890';

                mocker.mock( {
                    subPath: `SMS/${ phoneNumber }/AUTOGEN`,
                    responseType: 'otpSent'
                } );

                try {

                    const response = await TwoFactor.OTP.sendOtp( {
                        phoneNumber
                    } );

                    expect( response.__MOCKED_RESPONSE_DATA__.Status ).to.equal( 'Success' );
                    expect( response.__MOCKED_RESPONSE_DATA__.Details ).to.match( Fixtures.guidRegexp );
                    expect( response.requestParameters.uri ).to.include( `/SMS/${ phoneNumber }/AUTOGEN` );

                } catch ( error ) { throw error; }

            } );

            it( 'forms and formats the GET request to generate an OTP correctly <Custom>', async () => {

                const phoneNumber = '1234567890';
                const otp = '123456';

                mocker.mock( {
                    subPath: `SMS/${ phoneNumber }/${ otp }`,
                    responseType: 'otpSent'
                } );

                try {

                    const response = await TwoFactor.OTP.sendOtp( {
                        phoneNumber,
                        otpType: TwoFactor.OTP.OtpTypes.custom,
                        otp
                    } );

                    expect( response.__MOCKED_RESPONSE_DATA__.Status ).to.equal( 'Success' );
                    expect( response.__MOCKED_RESPONSE_DATA__.Details ).to.match( Fixtures.guidRegexp );
                    expect( response.requestParameters.uri ).to.include( `/SMS/${ phoneNumber }/${ otp }` );

                } catch ( error ) { throw error; }

            } );

        } );

        describe( '### Voice', () => {

            it( 'forms and formats the GET request to generate an OTP correctly <Auto>', async () => {

                const phoneNumber = '1234567890';

                mocker.mock( {
                    subPath: `VOICE/${ phoneNumber }/AUTOGEN`,
                    responseType: 'otpSent'
                } );

                try {

                    const response = await TwoFactor.OTP.sendOtp( {
                        phoneNumber,
                        deliveryType: TwoFactor.OTP.DeliveryTypes.voice
                    } );

                    expect( response.__MOCKED_RESPONSE_DATA__.Status ).to.equal( 'Success' );
                    expect( response.__MOCKED_RESPONSE_DATA__.Details ).to.match( Fixtures.guidRegexp );
                    expect( response.requestParameters.uri ).to.include( `/VOICE/${ phoneNumber }/AUTOGEN` );

                } catch ( error ) { throw error; }

            } );

            it( 'forms and formats the GET request to generate an OTP correctly <Custom>', async () => {

                const phoneNumber = '1234567890';
                const otp = '123456';

                mocker.mock( {
                    subPath: `VOICE/${ phoneNumber }/${ otp }`,
                    responseType: 'otpSent'
                } );

                try {

                    const response = await TwoFactor.OTP.sendOtp( {
                        phoneNumber,
                        otpType: TwoFactor.OTP.OtpTypes.custom,
                        deliveryType: TwoFactor.OTP.DeliveryTypes.voice,
                        otp
                    } );

                    expect( response.__MOCKED_RESPONSE_DATA__.Status ).to.equal( 'Success' );
                    expect( response.__MOCKED_RESPONSE_DATA__.Details ).to.match( Fixtures.guidRegexp );
                    expect( response.requestParameters.uri ).to.include( `/VOICE/${ phoneNumber }/${ otp }` );

                } catch ( error ) { throw error; }

            } );

        } );

    } );

    describe( '## Verify', () => {

        describe( '### Parameter Envelope', () => {

            it( 'throws an error when no parameter object is provided', () => {

                expect( () => TwoFactor.OTP.verifyOtp() ).to.throw( Error );

            } );

            const testCases = [ 12345, () => {}, [], 'string' ];
            for( const testCase of testCases ) {

                it( `throws an Error when the envelope is not an object: <${ typeof testCase }>`, () => {

                    expect( () => TwoFactor.OTP.verifyOtp( testCase ) ).to.throw( Error );

                } );

            }

        } );

        it( 'throws an error when "otp" is not provided', () => {

            expect( () => TwoFactor.OTP.verifyOtp( {} ) ).to.throw( Error );

        } );

        it( 'throws an error when "otp" is not a string', () => {

            expect( () => TwoFactor.OTP.verifyOtp( { otp: 123 } ) ).to.throw( TypeError );

        } );

        it( 'throws an error when "sessionId" is not provided', () => {

            expect( () => TwoFactor.OTP.verifyOtp( { otp: '123456' } ) ).to.throw( Error );

        } );

        it( 'throws an error when "sessionId" is not a string', () => {

            expect( () => TwoFactor.OTP.verifyOtp( { otp: '123456', sessionId: 123 } ) ).to.throw( TypeError );

        } );

        it( 'throws an error when "sessionId" is not a valid GUID', () => {

            expect( () => TwoFactor.OTP.verifyOtp( {
                otp: '123456',
                sessionId: '1234567'
            } ) ).to.throw( TypeError );

        } );

        it( 'forms and formats the GET request to validate an OTP correctly <Voice>', async () => {

            const otp = '123456';
            const sessionId = '39588846-d595-4407-996a-cdb50edece26';

            mocker.mock( {
                subPath: `VOICE/VERIFY/${ sessionId }/${ otp }`,
                responseType: 'otpMatched'
            } );

            try {

                const response = await TwoFactor.OTP.verifyOtp( {
                    otp,
                    deliveryType: TwoFactor.OTP.DeliveryTypes.voice,
                    sessionId
                } );

                expect( response.__MOCKED_RESPONSE_DATA__.Status ).to.equal( 'Success' );
                expect( response.__MOCKED_RESPONSE_DATA__.Details ).to.equal( 'OTP Matched' );
                expect( response.requestParameters.uri ).to.include( `VOICE/VERIFY/${ sessionId }/${ otp }` );

            } catch ( error ) { throw error; }

        } );

        it( 'forms and formats the GET request to validate an OTP correctly <SMS>', async () => {

            const otp = '123456';
            const sessionId = '39588846-d595-4407-996a-cdb50edece26';

            mocker.mock( {
                subPath: `SMS/VERIFY/${ sessionId }/${ otp }`,
                responseType: 'otpMatched'
            } );

            try {

                const response = await TwoFactor.OTP.verifyOtp( {
                    otp,
                    sessionId
                } );

                expect( response.__MOCKED_RESPONSE_DATA__.Status ).to.equal( 'Success' );
                expect( response.__MOCKED_RESPONSE_DATA__.Details ).to.equal( 'OTP Matched' );
                expect( response.requestParameters.uri ).to.include( `SMS/VERIFY/${ sessionId }/${ otp }` );

            } catch ( error ) { throw error; }

        } );

    } );

} );
