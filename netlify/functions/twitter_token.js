const fetch = require('node-fetch')

// Need for CORS
const resHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json',
};

const headers = {
  ...resHeaders,
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': `Basic ${process.env.TWITTER_CLIENT_BASIC_AUTH}`,
};

const handler = async (event) => {
  console.info(`FIXME 後で消す  -> handler -> event:`, event);

  try {
    const code = event.queryStringParameters.code ?? 'empty';
    const client_id = process.env.TWITTER_CLIENT_ID;
    const redirect_uri = process.env.TWITTER_REDIRECT_URI;
    const grant_type = 'authorization_code';

    const url = 'https://api.twitter.com/2/oauth2/token';
    const body = new URLSearchParams({
      code,
      grant_type,
      redirect_uri,
      code_verifier: 'challenge',
      client_id,
    });
    
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    

    if (!res.ok) {
      console.log(`FIXME 後で消す  -> handler -> res.status:`, res.status);
      return {
        statusCode: res.status,
        headers: resHeaders,
        body: JSON.stringify(res)
      }
    };

    const tokenResponse = await res.json();
    console.info(`handler - `, tokenResponse); // { access_token: 'QWOxxxx' }

    return {
      statusCode: 200,
      headers: resHeaders,
      body: JSON.stringify(tokenResponse)
    }
  } catch (error) {
    console.log(`FIXME 後で消す  -> handler -> error:`, error);
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }