const test = require( 'tape' );
const { TwoFactor, mocker } = require( '../fixtures' );

test( 'the transactional object is valid', t => {

    t.equal( typeof TwoFactor.Transactional, 'object' );
    t.end();

} );

test( 'the balance should be returned properly', async t => {

    mocker.mock( {
        subPath: 'ADDON_SERVICES/BAL/TRANSACTIONAL_SMS',
        responseType: 'transactionalBalance'
    } );

    try {

        const response = await TwoFactor.Transactional.getBalance();

        t.deepEqual( response.__MOCKED_RESPONSE_DATA__, {
            Status: 'Success',
            Details: '500'
        } );

        t.end();

    } catch ( error ) {

        throw error;

    }

} );

test( 'throw an error when the parameter envelope is falsy', t => {

    t.throws( () => {

        TwoFactor.Transactional.sendMessage();

    }, Error );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( null );

    }, Error );

    t.end();

} );

test( 'throw an error when the parameter envelope is not an object', t => {

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( 1234 );

    }, TypeError );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( () => {} );

    }, TypeError );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( 'string' );

    }, TypeError );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( [] );

    }, Error );

    t.end();

} );

test( 'throw an error if required parameters are falsy or of incorrect type <Open>', t => {

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( {} );

    }, Error );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( { from: 1234567890 } );

    }, TypeError );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( { from: true } );

    }, TypeError );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( { from: [] } );

    }, TypeError );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( { from: {} } );

    }, TypeError );

    // ----

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( { from: '1234567890', to: 123456789 } );

    }, TypeError );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( { from: '1234567890', to: true } );

    }, TypeError );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( { from: '1234567890', to: {} } );

    }, TypeError );

    // ----

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( {
            from: '1234567890',
            to: '123456789',
            templateType: 'open',
            message: {}
        } );

    }, TypeError );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( {
            from: '1234567890',
            to: '1234567890',
            templateType: 'open',
            message: () => {}
        } );

    }, TypeError );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( {
            from: '1234567890',
            to: '1234567890',
            templateType: 'open',
            message: 1235
        } );

    }, Error );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( {
            from: '1234567890',
            to: '1234567890',
            templateType: 'open',
            message: []
        } );

    }, TypeError );

    // ----

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( {
            from: '1234567890',
            to: '123456789',
            message: 'test',
            templateType: 'hello'
        } );

    }, TypeError );

    t.end();

} );

test( 'send a valid and well-formed request to send a transactional SMS <Open>', async t => {

    mocker.mock( {
        subPath: 'ADDON_SERVICES/SEND/TSMS',
        responseType: 'transactionalMessage',
        method: 'POST'
    } );

    try {

        let response = await TwoFactor.Transactional.sendMessage( {
            from: 'TWOFCT',
            to: '1234567890',
            templateType: TwoFactor.Transactional.TemplateTypes.open,
            message: 'Hello World!'
        } );

        let responseData = response.requestParameters.requestBody;

        t.equal( responseData.From, 'TWOFCT' );
        t.equal( responseData.To, '1234567890' );
        t.equal( responseData.Msg, 'Hello World!' );

        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, '26aa1e7a-7756-41c4-956d-4c0182ea5c1102187af6c0.61189183' );

        mocker.mock( {
            subPath: 'ADDON_SERVICES/SEND/TSMS',
            responseType: 'transactionalMessage',
            method: 'POST'
        } );

        response = await TwoFactor.Transactional.sendMessage( {
            from: 'TWOFCT',
            to: [ '1234567890', '0987654321' ],
            templateType: TwoFactor.Transactional.TemplateTypes.open,
            message: 'Hello World!'
        } );

        responseData = response.requestParameters.requestBody;

        t.equal( responseData.From, 'TWOFCT' );
        t.equal( responseData.To, '1234567890,0987654321' );
        t.equal( responseData.Msg, 'Hello World!' );

        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, '26aa1e7a-7756-41c4-956d-4c0182ea5c1102187af6c0.61189183' );

        t.end();

    } catch ( error ) {

        throw error;

    }

} );

test( 'throws an errors when required parameters are missing <Dynamic>', t => {

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( {
            from: '1234567890',
            to: '123456789',
            templateName: {}
        } );

    }, TypeError );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( {
            from: '1234567890',
            to: '1234567890',
            templateName: () => {}
        } );

    }, TypeError );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( {
            from: '1234567890',
            to: '1234567890',
            templateName: 1235
        } );

    }, Error );

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( {
            from: '1234567890',
            to: '1234567890',
            templateName: []
        } );

    }, TypeError );

    // ----

    t.throws( () => {

        TwoFactor.Transactional.sendMessage( {
            from: '1234567890',
            to: '123456789',
            message: 'test',
            templateType: 'hello'
        } );

    }, TypeError );

    t.end();

} );

test( 'correctly forms and sends a request to send a dynamic transactional message', async t => {

    mocker.mock( {
        subPath: 'ADDON_SERVICES/SEND/TSMS',
        responseType: 'transactionalMessage',
        method: 'POST'
    } );

    try {

        let response = await TwoFactor.Transactional.sendMessage( {
            from: 'TWOFCT',
            to: '1234567890',
            templateName: 'testing'
        } );

        let responseData = response.requestParameters.requestBody;

        t.equal( responseData.From, 'TWOFCT' );
        t.equal( responseData.To, '1234567890' );
        t.equal( responseData.TemplateName, 'testing' );

        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, '26aa1e7a-7756-41c4-956d-4c0182ea5c1102187af6c0.61189183' );

        mocker.mock( {
            subPath: 'ADDON_SERVICES/SEND/TSMS',
            responseType: 'transactionalMessage',
            method: 'POST'
        } );

        response = await TwoFactor.Transactional.sendMessage( {
            from: 'TWOFCT',
            to: [ '1234567890', '0987654321' ],
            templateName: 'testing'
        } );

        responseData = response.requestParameters.requestBody;

        t.equal( responseData.From, 'TWOFCT' );
        t.equal( responseData.To, '1234567890,0987654321' );
        t.equal( responseData.TemplateName, 'testing' );

        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, '26aa1e7a-7756-41c4-956d-4c0182ea5c1102187af6c0.61189183' );

        t.end();

    } catch ( error ) {

        throw error;

    }

} );

test( 'form and send the correct POST request for dynamic templates and variables', async t => {

    mocker.mock( {
        subPath: 'ADDON_SERVICES/SEND/TSMS',
        responseType: 'transactionalMessage',
        method: 'POST'
    } );

    try {

        let response = await TwoFactor.Transactional.sendMessage( {
            from: 'TWOFCT',
            to: '1234567890',
            templateName: 'testing',
            var1: 'testVar',
            var2: 'testVar'
        } );

        let responseData = response.requestParameters.requestBody;

        t.equal( responseData.From, 'TWOFCT' );
        t.equal( responseData.To, '1234567890' );
        t.equal( responseData.TemplateName, 'testing' );
        t.equal( responseData.VAR1, 'testVar' );
        t.equal( responseData.VAR2, 'testVar' );

        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, '26aa1e7a-7756-41c4-956d-4c0182ea5c1102187af6c0.61189183' );

        mocker.mock( {
            subPath: 'ADDON_SERVICES/SEND/TSMS',
            responseType: 'transactionalMessage',
            method: 'POST'
        } );

        response = await TwoFactor.Transactional.sendMessage( {
            from: 'TWOFCT',
            to: [ '1234567890', '0987654321' ],
            templateName: 'testing',
            var1: 'testVar',
            var2: 'testVar'
        } );

        responseData = response.requestParameters.requestBody;

        t.equal( responseData.From, 'TWOFCT' );
        t.equal( responseData.To, '1234567890,0987654321' );
        t.equal( responseData.TemplateName, 'testing' );
        t.equal( responseData.VAR1, 'testVar' );
        t.equal( responseData.VAR2, 'testVar' );

        t.equal( response.__MOCKED_RESPONSE_DATA__.Status, 'Success' );
        t.equal( response.__MOCKED_RESPONSE_DATA__.Details, '26aa1e7a-7756-41c4-956d-4c0182ea5c1102187af6c0.61189183' );

        t.end();

    } catch ( error ) {

        throw error;

    }

} );
