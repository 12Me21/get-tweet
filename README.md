because the twitter API doesn't use CORS, the only way to download tweets in browser js is with JSONP, which the old v1 and v1.1 APIs support.  
the v1.1 api requires authentication which afaik can't be used with jsonp, so the only option is the last remaining endpoint of the v1 API.

https://12Me21.github.io/get-tweet/
