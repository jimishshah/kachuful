const aa = require("../../../server/lambdas/websockets/distribute-cards")
  .handler;

test("distribute cards", async () => {
  await aa();
  console.log(aa);
});
