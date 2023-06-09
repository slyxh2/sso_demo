const config = {
    saml: {
        cert: './okta.cert',
        entryPoint: 'https://dev-64126030.okta.com/app/dev-64126030_demo_1/exk9w5tydtehULUKJ5d7/sso/saml',
        issuer: 'http://www.okta.com/exk9w5tydtehULUKJ5d7',
        options: {
            failureRedirect: '/login',
            failureFlash: true
        }
    },
    server: {
        port: 1337
    },
    session: {
        resave: false,
        secret: 'supersecretamazingpassword',
        saveUninitialized: true
    }
};

module.exports = config;