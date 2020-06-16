function logger(message) {
  console.log(`DEBUG_MY_CODE: ${JSON.stringify(message)}`);
}
module.exports = logger;
