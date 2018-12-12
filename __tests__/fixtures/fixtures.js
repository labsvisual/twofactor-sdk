module.exports = {

    errors: {
        verifyError: {
            Status: 'Error',
            Details: 'OTP Mismatch'
        },
        apiKeyError: {
            Status: 'Error',
            Details: 'Invalid API / SessionId Combination - No Entry Exists'
        }
    },

    responses: {
        otpSent: {
            Status: 'Success',
            Details: 'c59103dd-fa46-11e8-a895-0200cd936042'
        },
        otpMatched: {
            Status: 'Success',
            Details: 'OTP Matched'
        },
        transactionalBalance: {
            Status: 'Success',
            Details: '500'
        },
        transactionalMessage: {
            Status: 'Success',
            Details: '26aa1e7a-7756-41c4-956d-4c0182ea5c1102187af6c0.61189183'
        }
    },

    guidRegexp: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

    exampleSchema: {
        $root: {
            allowUndefined: false,
            allowNull: false,
            allowedTypes: [ 'string', 'object' ]
        },
        test: {
            allowedTypes: 'string',
            isOptional: true
        }
    }

};
