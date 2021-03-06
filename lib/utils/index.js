const guidRegexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

module.exports = {

    isGuidValid( guid ) {

        return guidRegexp.exec( guid );

    },

    guidRegexp,
    SchemaValidator: require( './schema-validator' )

};
