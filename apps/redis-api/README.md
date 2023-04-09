For caching user selected options, we use the [Redis](http://redis.io/) key-value store. This package provides a simple API for interacting with Redis.
We need this API because CloudFlare Workers (they doesn't support TCP)
