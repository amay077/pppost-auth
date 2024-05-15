const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ build_at: '2024-05-15T09:44:43.275Z', env_ver: process.env.ENV_VER })
  }
}

module.exports = { handler }