"use strict";

require("dotenv").config();

const ENV_VARS = [
    "PAGE_ACCESS_TOKEN",
    "VERIFY_TOKEN"
];

module.exports = {
    apiDomain: "https://graph.facebook.com",
    apiVersion: "v12.0",
    pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
    verifyToken: process.env.VERIFY_TOKEN,
    port: process.env.PORT || 1337,
    get apiUrl() {
        return `${this.apiDomain}/${this.apiVersion}`;
    },
    checkEnvVariables: function() {
        ENV_VARS.forEach(function(key) {
            if (!process.env[key]) {
                console.warn(`WARNING: Missing required environment variable ${key}`);
            }
        });
    }
};
