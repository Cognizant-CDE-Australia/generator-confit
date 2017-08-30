function getServerURL (serverConfig) {
  return `${serverConfig.protocol}://${serverConfig.hostname}:${serverConfig.port}/`;
}

module.exports = {
  getServerURL
};
