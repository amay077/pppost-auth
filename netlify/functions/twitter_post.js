const handler = async (event) => {
  console.info(`FIXME 後で消す  -> handler -> event:`, event);

    try {
    const { accessToken, accessSecret, text } = JSON.parse(event.body); // as { refresh_token: string, text: string };
    console.info(`FIXME 後で消す  -> handler -> refresh_token:`, accessToken, accessSecret);

    const { TwitterApi } = require('twitter-api-v2');
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_APPKEY, 
      appSecret: process.env.TWITTER_APPSECRET,
      accessToken,
      accessSecret, 
    });

    await twitterClient.v2.tweet(text);

    // const mediaRes = await twitterClient.v1.uploadMedia('/Volumes/extssd/data/Downloads/2024/penguin_king_hina.png');
    // // const mediaRes = await twitterClient.v1.uploadMedia(buffer, { mimeType: 'image/gif' });    
    // console.info(mediaRes);

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({  })
    };
    console.info('3. tweet scceeded', response);
    return response;
  } catch (error) {
    console.log(`handler -> error:`, error);
    
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }