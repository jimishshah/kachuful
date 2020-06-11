function isLocal() {
  console.log(process.env.USER);
  return process.env.USER === "shahj07" || process.env.USER === "jimishshah" ? true : false;
}
module.exports = isLocal;
