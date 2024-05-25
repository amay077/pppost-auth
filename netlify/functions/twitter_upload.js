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

    // const form = await event.formData()
    // const file = form.get("file");
    // console.info('file', file);

    // const {  token ,text, images } = JSON.parse(event.body); // as { refresh_token: string, text: string };

    // const { accessToken, accessSecret } = JSON.parse(decrypt(token));
    // console.info(`FIXME 後で消す  -> handler -> refresh_token:`, accessToken, accessSecret);

    // const { TwitterApi } = require('twitter-api-v2');
    // const twitterClient = new TwitterApi({
    //   appKey: process.env.TWITTER_APPKEY, 
    //   appSecret: process.env.TWITTER_APPSECRET,
    //   accessToken,
    //   accessSecret, 
    // });

    // const fs = require('fs');
    // const regex = /^data:.+\/(.+);base64,(.*)$/;

    // const media_ids = [];
    // for (const dataUrl of images) {
    //   const matches = dataUrl.match(regex);
    //   const ext = matches[1];
    //   const data = matches[2];
    //   const buffer = Buffer.from(data, 'base64');
    //   const path = `/tmp/data_${new Date().toISOString()}.${ext}`
    //   fs.writeFileSync(path, buffer);
    //   // const mediaRes = await twitterClient.v1.uploadMedia('/Users/h_okuyama/Downloads/2024/penguin_king_hina.png');
    //   const mediaRes = await twitterClient.v1.uploadMedia(path);
    //   // const mediaRes = await twitterClient.v1.uploadMedia(buffer, { mimeType: 'image/gif' });    
    //   console.info(mediaRes);      
    //   media_ids.push(mediaRes);
    // }

    // const media = (() => {
    //   if (media_ids.length <= 0) {
    //     return undefined;
    //   }

    //   return {
    //     media_ids
    //   };
    // })();

    // await twitterClient.v2.tweet(text, { media });


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