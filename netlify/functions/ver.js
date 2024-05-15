const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ build_at: 'xxxx', env_ver: process.env.ENV_VER })
  }
}

module.exports = { handler }