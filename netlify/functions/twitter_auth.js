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
    const { TwitterApi } = require('twitter-api-v2');
    const client = new TwitterApi({ appKey: process.env.TWITTER_APPKEY , appSecret: process.env.TWITTER_APPSECRET });
    const authLink = await client.generateAuthLink(`oob`);

    console.info(authLink);

    const { oauth_token, url } = authLink;

    // authLink をファイルに保存する
    const { getStore } =  require('@netlify/blobs');
    const store = getStore("construction");
    store.setJSON(oauth_token, authLink);
    // fs.writeFileSync(`/tmp/${oauth_token}.json`,  JSON.stringify(authLink));
    

    return {
      statusCode: 200,
      headers: resHeaders,
      body: JSON.stringify({ oauth_token, url })
    }
  } catch (error) {
    console.log(`FIXME 後で消す  -> handler -> error:`, error);
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }