# Cthulhu Auth

This module provides social authentication strategies in the vain of passport
and everyauth but comes coupled many strategies.

### Available Strategies
* **Facebook**
* **Google**
* **Twitter**
* **Foursquare**
* **GitHub**

## Usage

```js
var app = require('cthulhu')({
  //...
});
var cthulhuAuth = require('cthulhu-auth');

app.use(cthulhuAuth.deserializeUser(function(user, done) {
  // Find user and pass done error and user
  // Example for Mongoose:
  // User.findOne(user.id).exec(done)
}));
```

### Facebook
  ```js
    //...
    var facebookAuth = require('cthulhu-auth').Facebook({
      app_id: 'APPID',
      app_secret: 'APPSECRET',
      callback_url: 'http://www.whatevz.com/auth/facebook/callback'
    });


    app.get('/auth/facebook', facebookAuth.authorize);
    app.get('/auth/facebook/callback', facebookAuth.callback, someCallback);
  ```

  The `.callback()` function attaches an `oauth` value to `req`:

  ```js
    req.oauth = {
      provier: 'facebook',
      token: 'access token from Facebook',
      profile: {
        // Profile of user from oauth provider
      }
    }
  ```

### GitHub

  ```js
  //...
  var githubAuth = require('cthulhu-auth').Github({
    client_id: 'CLIENTID',
    client_secret: 'CLIENTSECRET',
    callback_url: 'http://www.whatevz.com/auth/github/callback'
  });


  app.get('/auth/github', githubAuth.authorize);
  app.get('/auth/github/callback', githubAuth.callback, someCallback);
  ```

  The `.callback()` function attaches an `oauth` value to `req`:

  ```js
  req.oauth = {
    provier: 'github',
    token: 'access token from GitHub',
    profile: {
      // Profile of user from oauth provider
    }
  }
  ```

### Google

  ```js
  //...
  var googleAuth = require('cthulhu-auth').Google({
    client_id: 'CLIENTID',
    client_secret: 'CLIENTSECRET',
    redirect_uri: 'http://www.whatevz.com/auth/google/callback'
  });


  app.get('/auth/google', googleAuth.authorize);
  app.get('/auth/google/callback', googleAuth.callback, someCallback);
  ```

  The `.callback()` function attaches an `oauth` value to `req`:

  ```js
  req.oauth = {
    provier: 'google',
    token: 'access token from Google',
    profile: {
      // Profile of user from oauth provider
    }
  }
  ```

### Twitter

  ```js
  //...
  var twitterAuth = require('cthulhu-auth').Twitter({
    consumer_key: 'CONSUMERKEY',
    consumer_secret: 'CONSUMERSECRET',
    callback_url: 'http://www.whatevz.com/auth/twitter/callback'
  });


  app.get('/auth/twitter', twitterAuth.authorize);
  app.get('/auth/twitter/callback', twitterAuth.callback, someCallback);
  ```

  The `.callback()` function attaches an `oauth` value to `req`:

  ```js
  req.oauth = {
    provier: 'twitter',
    token: 'access token from twiter',
    secret: 'secret from Twitter'
    profile: {
      // Profile of user from oauth provider
    }
  }
  ```

### Foursquare

  ```js
  //...
  var foursquareAuth = require('cthulhu-auth').Foursquare({
    client_id: 'CLIENTID',
    client_secret: 'CLIENTSECRET',
    callback_url: 'http://www.whatevz.com/auth/foursquare/callback'
  });


  app.get('/auth/foursquare', foursquareAuth.authorize);
  app.get('/auth/foursquare/callback', foursquareAuth.callback, someCallback);
  ```

  The `.callback()` function attaches an `oauth` value to `req`:

  ```js
  req.oauth = {
    provier: 'foursquare',
    token: 'access token from Foursquare',
    profile: {
      // Profile of user from oauth provider
    }
  }
  ```
