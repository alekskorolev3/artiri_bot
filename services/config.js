"use strict";

// Use dotenv to read .env vars into Node
require("dotenv").config();

// Required environment variables
const ENV_VARS = [
    "PAGE_ACCESS_TOKEN",
    "VERIFY_TOKEN"
];

module.exports = {
    // Messenger Platform API
    apiDomain: "https://graph.facebook.com",
    apiVersion: "v12.0",

    // Page and Application information
    pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
    verifyToken: process.env.VERIFY_TOKEN,

    // Preferred port (default to 3000)
    port: process.env.PORT || 1337,

    checkEnvVariables: function() {
        ENV_VARS.forEach(function(key) {
            if (!process.env[key]) {
                console.warn(`WARNING: Missing required environment variable ${key}`);
            }
        });
    }
};
