# Cthulhu Auth

This module provides social authentication strategies in the vain of passport
and everyauth but comes coupled many strategies.

## Usage

  ```js
    var app = require('cthulhu');
    var router = app.Router();
    var facebookAuth = require('cthulhu-auth').facebook({
      app_id: 'APPID',
      app_secret: 'APPSECRET',
      callback_url: '/auth/facebook'
    });

    app.get('/auth/facebook', facebookAuth.authorize);
    app.get('/auth/facebook', facebookAuth.callback, someCallback);
  ```

  The callback functions of the strategies attach the following values to `req._oauth`:

  ```js
    {
      token: 'token from oauth provider',
      profile: {
        // Profile of user from oauth provider
      }
    }
  ```
