function isLocal() {
  return process.env.USER === "shahj07" ? true : false;
}
module.exports = isLocal;
