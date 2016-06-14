# URL Shortener Microservice

This API takes a url passed in as a parameter and outputs a shortened URL as a JSON response.

1. Pass a URL as a parameter to receive a shortened URL in the JSON response.
2. If the URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
3. Visiting the shortened URL will redirect you to the original link.

With Node.js, Express.js, MongoDB

## Usage

#### Example Usage

```
http://shorturl-ytv.herokuapp.com/https://thisisaverylongurlforawebpage.com
```

#### Example Output
```javascript
{
    "original_url": "https://thisisaverylongurlforawebpage.com",
    "shortened_url": 2185
}
```

#### New URL Generated
```
http://shorturl-ytv.herokuapp.com/2185
```

#### Will Redirect To:
```
https://thisisaverylongurlforawebpage.com
```

## See it Live

[http://shorturl-ytv.herokuapp.com](http://shorturl-ytv.herokuapp.com)

## Launch

Launch this project with node `index.js`.
