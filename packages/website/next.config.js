const { createSecureHeaders } = require("next-secure-headers");

module.exports = {
    assetPrefix: '/roles-bot/',
    async headers() {
        return [{
          source: "/(.*)",
          headers: createSecureHeaders({
            forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
            referrerPolicy: "same-origin",
          }),
        }];
    },
}