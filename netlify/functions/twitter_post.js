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

    const { TwitterApi } = require('twitter-api-v2');
    // const twitterClient = new TwitterApi({
    //   appKey: '5GefBvuEGra2bJSGSo84hrMLP', 
    //   appSecret: `laPLj4wYC7qZnb9fYfCHCGfAzUlhJweRvPbykKYf0emq0DMp40`,
    //   accessToken: `726470840817065984-UZYNgwrRF6bznrUCPQpP5nd8TNyuoRL`,
    //   accessSecret: `ShK37K3bWszjEB7AypytDQOiD7NoyxmCIC4gweoFlvxq0`, 
    // });
    // const twitterClient = new TwitterApi(access_token);
    // const twitterClient = new TwitterApi({ username: 'carry_hamham', password: 'M1ldwolf' });    
    // const consumerClient = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAKd3twEAAAAAZho4PJS3fuv%2FFdxIfdG37Qty%2FzE%3DJ27dWKx959ouwRfwjV7yM0uqO3uQXhfsbPXF62HzpyQuOAXa4H');
    const client = new TwitterApi({ appKey: '5GefBvuEGra2bJSGSo84hrMLP', appSecret: `laPLj4wYC7qZnb9fYfCHCGfAzUlhJweRvPbykKYf0emq0DMp40` });
    const authLink = await client.generateAuthLink(`oob`);
    console.log(`FIXME h_oku 後で消す  -> handler -> authLink:`, authLink);

    // const authClient = new TwitterApi({
    //   appKey: '5GefBvuEGra2bJSGSo84hrMLP', 
    //   appSecret: `laPLj4wYC7qZnb9fYfCHCGfAzUlhJweRvPbykKYf0emq0DMp40`,
    //   accessToken: `c7UU-gAAAAABt3enAAABj5Ykbew`,
    //   accessSecret: `N2IhGMuO3i8s56sT5fwwbJ4OK6zRoTnH`,
    // });
    // const { client: twitterClient, accessToken, accessSecret } = await authClient.login(`79AyVTXP80PBoTW3v12bsCUIt2G6j2Sc`)    

    // console.log(`FIXME h_oku 後で消す  -> handler -> accessToken, accessSecret:`, accessToken, accessSecret);

    // 
    //     
    // Obtain app-only client
    // const twitterClient = await consumerClient.appLogin();    


    // await twitterClient.v1.tweet('Hello, this is a test.' + new Date().toISOString());


    await twitterClient.v2.tweet('Hello, this is a test.' + new Date().toISOString());
    // const buffer = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');

    const mediaRes = await twitterClient.v1.uploadMedia('/Volumes/extssd/data/Downloads/2024/penguin_king_hina.png');
    // const mediaRes = await twitterClient.v1.uploadMedia(buffer, { mimeType: 'image/gif' });    
    console.info(mediaRes);


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