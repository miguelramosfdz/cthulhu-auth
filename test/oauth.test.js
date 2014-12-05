describe('Util: OAuth', function() {
  'use strict';
  
  var oauth = require('../../util/oauth');

  console.log(oauth);

  describe('Facebook Strategy', function() {
    it('should throw error if no app_id', function() {
      expect(oauth.bind(this, { 
        Facebook: {
          app_secret: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Facebook with app_id');
    });
    it('should throw error if no app_secret', function() {
      expect(oauth.bind(this, { 
        Facebook: {
          app_id: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Facebook with app_secret');
    });
    it('should throw error if no callback_url', function() {
      expect(oauth.bind(this, { 
        Facebook: {
          app_id: 'fooId',
          app_secret: 'fooSecret'
        } 
      })).to.throw('Must supply Facebook with callback_url');
    });
    it('should set Facebook', function() {
      var auth = oauth({ 
        Facebook: {
          app_id: 'fooId',
          app_secret: 'fooSecret',
          callback_url: 'http://foo.com'
        } 
      });
      expect(auth.Facebook.app_id).to.equal('fooId');
      expect(auth.Facebook.app_secret).to.equal('fooSecret');
      expect(auth.Facebook.callback_url).to.equal('http://foo.com');
    });
  });

  describe('Google Strategy', function() {
    it('should throw error if no client_id', function() {
      expect(oauth.bind(this, { 
        Google: {
          app_secret: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Google Strategy with client_id');
    });
    it('should throw error if no client_secret', function() {
      expect(oauth.bind(this, { 
        Google: {
          client_id: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Google Strategy with client_secret');
    });
    it('should throw error if no redirect_uri', function() {
      expect(oauth.bind(this, { 
        Google: {
          client_id: 'fooId',
          client_secret: 'fooSecret'
        } 
      })).to.throw('Must supply Google Strategy with redirect_uri');
    });
    it('should set Google', function() {
      var auth = oauth({ 
        Google: {
          client_id: 'fooId',
          client_secret: 'fooSecret',
          redirect_uri: 'http://foo.com'
        } 
      });
      expect(auth.Google.client_id).to.equal('fooId');
      expect(auth.Google.client_secret).to.equal('fooSecret');
      expect(auth.Google.redirect_uri).to.equal('http://foo.com');
    });
  });

  describe('Twitter Strategy', function() {
    it('should throw error if no client_id', function() {
      expect(oauth.bind(this, { 
        Twitter: {
          consumer_secret: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Twitter Strategy with consumer_key');
    });
    it('should throw error if no client_secret', function() {
      expect(oauth.bind(this, { 
        Twitter: {
          consumer_key: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Twitter Strategy with consumer_secret');
    });
    it('should throw error if no callback_url', function() {
      expect(oauth.bind(this, { 
        Twitter: {
          consumer_key: 'fooId',
          consumer_secret: 'fooSecret'
        } 
      })).to.throw('Must supply Twitter Strategy with callback_url');
    });
    it('should set Twitter', function() {
      var auth = oauth({ 
        Twitter: {
          consumer_key: 'fooId',
          consumer_secret: 'fooSecret',
          callback_url: 'http://foo.com'
        } 
      });
      expect(auth.Twitter.consumer_key).to.equal('fooId');
      expect(auth.Twitter.consumer_secret).to.equal('fooSecret');
      expect(auth.Twitter.callback_url).to.equal('http://foo.com');
    });
  });

  describe('Foursquare Strategy', function() {
    it('should throw error if no client_id', function() {
      expect(oauth.bind(this, { 
        Foursquare: {
          client_secret: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Foursquare Strategy with client_id');
    });
    it('should throw error if no client_secret', function() {
      expect(oauth.bind(this, { 
        Foursquare: {
          client_id: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Foursquare Strategy with client_secret');
    });
    it('should throw error if no callback_url', function() {
      expect(oauth.bind(this, { 
        Foursquare: {
          client_id: 'fooId',
          client_secret: 'fooSecret'
        } 
      })).to.throw('Must supply Foursquare Strategy with callback_url');
    });
    it('should set Foursquare', function() {
      var auth = oauth({ 
        Foursquare: {
          client_id: 'fooId',
          client_secret: 'fooSecret',
          callback_url: 'http://foo.com'
        } 
      });
      expect(auth.Foursquare.client_id).to.equal('fooId');
      expect(auth.Foursquare.client_secret).to.equal('fooSecret');
      expect(auth.Foursquare.callback_url).to.equal('http://foo.com');
    });
  });

  describe('Github Strategy', function() {
    it('should throw error if no client_id', function() {
      expect(oauth.bind(this, { 
        Github: {
          client_secret: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Github Strategy with client_id');
    });
    it('should throw error if no client_secret', function() {
      expect(oauth.bind(this, { 
        Github: {
          client_id: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Github Strategy with client_secret');
    });
    it('should throw error if no callback_url', function() {
      expect(oauth.bind(this, { 
        Github: {
          client_id: 'fooId',
          client_secret: 'fooSecret'
        } 
      })).to.throw('Must supply Github Strategy with callback_url');
    });
    it('should set Github', function() {
      var auth = oauth({
        Github: {
          client_id: 'fooId',
          client_secret: 'fooSecret',
          callback_url: 'http://foo.com'
        } 
      });
      expect(auth.Github.client_id).to.equal('fooId');
      expect(auth.Github.client_secret).to.equal('fooSecret');
      expect(auth.Github.callback_url).to.equal('http://foo.com');
    });
  });

});
