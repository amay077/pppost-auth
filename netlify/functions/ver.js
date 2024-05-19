const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ build_at: 'xxxxxx', env_ver: process.env.ENV_VER })
  }
}

module.exports = { handler }