const fs = require('fs');

// Need for CORS
const resHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json',
};

const handler = async (event) => {
  console.info(`FIXME 後で消す  -> handler -> event:`, event);

  try {
    const code = event.queryStringParameters.code ?? 'empty';
    const oauth_token = event.queryStringParameters.oauth_token ?? 'empty';

    // const text = fs.readFileSync(`/tmp/${oauth_token}.json`);
    // const authLink = JSON.parse(text);

    const { getStore } =  require('@netlify/blobs');
    const store = getStore("construction");
    const authLink = store.get(oauth_token);
    console.log(`FIXME  -> handler -> authLink:`, authLink);

    const { TwitterApi } = require('twitter-api-v2');
    const authClient = new TwitterApi({ 
      appKey: process.env.TWITTER_APPKEY, 
      appSecret: process.env.TWITTER_APPSECRET,
      accessToken: oauth_token,
      accessSecret: authLink.oauth_token_secret,
    });

    const { accessToken, accessSecret } = await authClient.login(code);
    console.info(`handler - `, accessToken, accessSecret); 
    
    return {
      statusCode: 200,
      headers: resHeaders,
      body: JSON.stringify({ accessToken, accessSecret })
    }
  } catch (error) {
    console.log(`FIXME 後で消す  -> handler -> error:`, error);
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }