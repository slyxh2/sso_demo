const http = require('http');
const express = require('express');
const session = require('express-session');
const config = require('./config/config');
const passport = require('./config/passport');

const router = express();

/** Server Handling */
const httpServer = http.createServer(router);

/** Log the request */
router.use((req, res, next) => {
    console.log(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        console.log(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Parse the body of the request / Passport */
router.use(session(config.session));
router.use(passport.initialize());
router.use(passport.session());
router.use(express.urlencoded({ extended: false })); // Replaces Body Parser
router.use(express.json()); // Replaces Body Parser

/** Rules of our API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.header('origin'));
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Passport & SAML Routes */
router.get('/login', passport.authenticate('saml', config.saml.options), (req, res, next) => {
    return res.redirect('http://localhost:3000');
});

router.post('/login/callback', passport.authenticate('saml', config.saml.options), (req, res, next) => {
    return res.redirect('http://localhost:3000');
});

router.get('/whoami', (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('User not authenticated');

        return res.status(401).json({
            message: 'Unauthorized'
        });
    } else {
        console.log('User authenticated');
        console.log(req.user);

        return res.status(200).json({ user: req.user });
    }
});

/** Health Check */
router.get('/healthcheck', (req, res, next) => {
    return res.status(200).json({ messgae: 'Server is running!' });
});

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

httpServer.listen(config.server.port, () => console.log(`Server is running on port ${config.server.port}`));