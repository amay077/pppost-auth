// 復号化関数
function decrypt(encryptedText) {
  const key = Buffer.from(process.env.DATA_SECRET).subarray(0, 32);
  const iv = Buffer.from(process.env.DATA_IV).subarray(0, 16);
  
  const crypto = require('crypto');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const handler = async (event) => {
  console.info(`FIXME 後で消す  -> handler -> event:`, event);

  try {
    const {  token ,text } = JSON.parse(event.body); // as { refresh_token: string, text: string };

    const { accessToken, accessSecret } = JSON.parse(decrypt(token));
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