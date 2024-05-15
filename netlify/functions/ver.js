const handler = async (event) => {
  return {
    statusCode: 200,
    body: { build_at: 'xxxx' }
  }
}

module.exports = { handler }