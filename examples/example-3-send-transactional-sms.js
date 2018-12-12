const { TwoFactor } = require( '../lib' );

const testFunction = async () => {

    const apiInstance = new TwoFactor( 'Your API Key' );

    try {

        const response = await apiInstance.Transactional.sendMessage( {
            to: 'XXXXXXXXX', // [ 'Phone 1', 'Phone 2' ]
            from: 'Your Short Code',
            templateName: 'Template Name',
            var1: 'Variable 1'
        } );

        console.log( response );

    } catch ( error ) {

        console.log( 'Error: ', error );

    }

};

testFunction();
