const fetch = require('node-fetch')

const handler = async (event) => {
  console.info(`FIXME h_oku 後で消す  -> handler -> event:`, event);

  try {
    const { refresh_token, text } = JSON.parse(event.body); // as { refresh_token: string, text: string };
    console.info(`FIXME h_oku 後で消す  -> handler -> refresh_token:`, refresh_token);

    const tokens = await (async () => {
      const res = await fetch(`https://api.twitter.com/2/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${process.env.TWITTER_CLIENT_BASIC_AUTH}`,        
        },
        body: `refresh_token=${refresh_token}&grant_type=refresh_token`,
      });
      
      if (!res.ok) {
        console.error(`token request failed: ${res.status}`)
        throw new Error(`token request failed: ${res.status}`);
      }

      const resJson = await res.json();
      return resJson;
    })();

    const res = await fetch(`https://api.twitter.com/2/tweets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });    

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify(res)
      }
    };

    console.info(`FIXME h_oku 後で消す  -> handler -> tokens:`, tokens);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ refresh_token: tokens.refresh_token })
    }
  } catch (error) {
    console.log(`handler -> error:`, error);
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }