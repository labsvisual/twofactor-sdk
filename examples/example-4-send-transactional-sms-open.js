const { TwoFactor } = require( '../lib' );

const testFunction = async () => {

    const apiInstance = new TwoFactor( 'Your API Key' );

    try {

        const response = await apiInstance.Transactional.sendMessage( {
            to: 'XXXXXXXXX', // [ 'Phone 1', 'Phone 2' ]
            from: 'Your Short Code',
            message: 'Your message here',
            templateType: apiInstance.Transactional.TemplateTypes.open
        } );

        console.log( response );

    } catch ( error ) {

        console.log( 'Error: ', error );

    }

};

testFunction();
