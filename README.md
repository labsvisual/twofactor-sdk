# TwoFactor Node.js SDK

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)


[![GitHub issues](https://img.shields.io/github/issues/labsvisual/twofactor-sdk.svg)](https://github.com/labsvisual/twofactor-sdk/issues)
[![codecov](https://codecov.io/gh/labsvisual/twofactor-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/labsvisual/twofactor-sdk)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub license](https://img.shields.io/github/license/labsvisual/twofactor-sdk.svg)](https://github.com/labsvisual/twofactor-sdk/blob/master/LICENSE)

## Introduction

Pretty much what the titel says: a wrapper around the [2Factor](https://2factor.in/) API.

### Installation

Installation is very simple and with just a:
```bash
npm install --save @twofactor/sdk
```
you are pretty much done.

However, if you are using Node.js version `7.0.0` or below, you might should also install the `babel` package to help the library automatically bootstrap everything and make it ready for use. You can do this by running:
```bash
npm i babel-core babel-polyfill babel-preset-es2015 babel-preset-stage-0 babel-register
```

You may get a warning about the now-deprecated `preset-es2015` and `preset-stage-0` package, but do not worry, this will **not** cause any error.

The library has inbuilt logic for intelligently checking if ES6 features are supported in your current Node.js runtime. If the are, it simply exports the primary API Object; otherwise, it uses `babel-register` to bootstrap everything so you face absolutely no issues when using the library in production.

## Getting Started
Since this library is nothing but a wrapper around the official TwoFactor API, I strongly recommend you to check out their [official documentation](https://2fa.api-docs.io/v1/send-sms-otp) before diving into this library.

### Library Design
The library has been designed and developed keeping modularity in mind. For that reason, you can either `require` the entire library or the bits and pieces you need by object destructuring or by using the dot property syntax.

As of now, the library **only** supports Promises; however, in the _near_ future, it will also support callbacks.

### Usage
In order to use the library, you first need to get hold of the `TwoFactor` constructor or whatever specific resource you require. For the course of this example, I will assume that you use the entire package.

```js
const { TwoFactor } = require( '@twofactor/sdk' );
```

With the constructor in hand, you can how initialize a new instance of the class:
```js
const apiObject = new TwoFactor( 'Your API Key' );
```
and now you have access to all the resources.

#### Namespacing
All of the resources currently supported by 2Factor are available as a part of the SDK. You can access them using the following general namespace syntax:
```
{apiObject}.{resourceName}.{method}({resourceId, {...parameters}}?)
```

The `{resourceId}?` syntax means that you can either pass an object containing the properties, but for functions which operate on **one** primary parameter (such as sending an OTP), you can simply pass in a String as the **first** argument and get away with it.

For example:
```js
apiObject.OTP.sendOtp( 'Phone Number' );
```
is equivalent to:
```js
apiObject.OTP.sendOtp( { phoneNumber: 'Phone Number' } );
```

## Resources
As of now, only the following resources are supported:
- [OTP](#resource__OTP)
    - Sending an OTP
    - Validating a OTP

However, in this, you have the choice of sending a custom OTP or a automatically generated one.

## <a name="resource__OTP"></a> `OTP`
Gives you access to the sending and validation mechanisms for One-Time Passwords.

### Basic Usage
```js
apiObject.OTP.sendOtp( 'Phone Number' )
    .then( console.log )
    .catch( console.error );
```

### Functions
The following functions are supported.

### `sendOtp`
Send an OTP to the specified phone number.

#### General Syntax

`.sendOtp( parameters: { String | Object } )`

#### `parameters`

If the `parameters` object is passed as a String, the library assumes that it's a phone number and sends an **automatically generated** OTP.

As an object, it can have the following properties:

- `phoneNumber`

    Type: `String, required`

- `deliveryType`

    Type: `Constant`

    Can be one of [OTP.DeliveryTypes](#constants__OTP--DeliveryTypes).

- `otpType`

    Type: `Constant`

    Can be one of [OTP.OtpTypes](#constants__OTP--OtpTypes).

- `otp`

    Type: `String`

    Required when `otpType` is `OtpTypes.custom`.

#### Return Value
A promise, which when resolved, gives the Session ID.

### `verifyOtp`
Verify the given OTP against a session ID.

#### General Syntax
`.verifyOtp( parameters: { Object } )`

#### `parameters`
The `parameters` object is required and it can have the following properties:

- `otp`

    Type: `String, required`

    This `otp` refers to the one entered by the user.

- `sessionId`

    Type: `String, required`

- `deliveryType`

    Type: `Constant`

    Can be one of [OTP.DeliveryTypes](#constants__OTP-

#### Return Value
A promise, which when resolved, signifies that the OTP matched; rejects otherwise.

---

## Global Constants
The initialized object also contains some handy constants to make the code a little more cleaner. They are as follows.

### <a name="constants__OTP--DeliveryTypes"></a> `OTP.DeliveryTypes`
Specifies the way the OTP will be delivered. It can be `.sms` or `.voice`.

### <a name="constants__OTP--OtpTypes"></a> `OTP.OtpTypes`
Specifies if the OTP should be generated automatically or if it should use a user-defined value. It can be `.custom` or `.auto`.

---

## Contributions

Any and everyone is welcome to hack the library and produce something better! Simply fork the repository, install the dependencies and start writing your features.

However, to make everyone's life a little easier, I would suggest the following:

- `git-flow` workflow is **highly** recommended; clone the repository, pull the current `develop` branch and start a new feature by `git flow feature start <featureName>`.
- Once you are done with your feature and you are satisfied with the test cases, commit all the changes and just quickly glance through the codebase (the part you changed; this is just done to make sure that the repository does not contain commits which change a space, etc.)
- Whoever uses `git-flow` has the habit of merging the code back with `develop` by running `git flow feature finish <featureName>`. Please do **not** do this. Instead, create a pull request with your `feature/featureName` branch.
- In the pull request, be sure to quickly outline what all you have modified. In case there are breaking changes, **do not forget** to mention that in the pull request's descriptions. 
