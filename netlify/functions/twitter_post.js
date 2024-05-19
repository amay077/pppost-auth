const fetch = require('node-fetch')

const handler = async (event) => {
  console.info(`FIXME 後で消す  -> handler -> event:`, event);

  // <TWITTER_CLIENT_ID>:<TWITTER_CLIENT_SECRET> を base64 エンコードしたもの
  const TWITTER_CLIENT_BASIC_AUTH = Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64');
  
  try {
    const { refresh_token, access_token, text } = JSON.parse(event.body); // as { refresh_token: string, text: string };
    console.info(`FIXME 後で消す  -> handler -> refresh_token:`, refresh_token);

    const tweet = async (access_token) => {
      const res = await fetch(`https://api.twitter.com/2/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });    
      return res;
    };

    console.info('1. tweet start');
    let res = await tweet(access_token);
    if (res.ok) {
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ refresh_token, access_token })
      };
      console.info('1. tweet 成功', response);
      return response;  
    } else {
      const err = await res.text();
      console.warn(`1. token request failed: ${res.status}, continue.`, err);
    }

    console.info('2. token refresh');
    const tokens = await (async () => {
      const body = new URLSearchParams({
        refresh_token,
        grant_type: 'refresh_token',
      });
        
      const res = await fetch(`https://api.twitter.com/2/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${TWITTER_CLIENT_BASIC_AUTH}`,
        },
        body,
      });
      
      if (!res.ok) {
        const err = await res.text();
        console.error(`2. token refresh failed: ${res.status}`, err)
        throw new Error(`token request failed: ${res.status}`);
      }

      const resJson = await res.json();
      return resJson;
    })();

    
    console.info('3. tweet start');
    res = await tweet(tokens.access_token);
    if (!res.ok) {
      const err = await res.text();
      console.error(`3. tweet failed: ${res.status}`, err)
      return {
        statusCode: res.status,
        body: JSON.stringify(res)
      }
    };

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ refresh_token: tokens.refresh_token, access_token: tokens.access_token })
    };
    console.info('3. tweet scceeded', response);
    return response;
  } catch (error) {
    console.log(`handler -> error:`, error);
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }