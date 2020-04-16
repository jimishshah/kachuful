import { websocketLink } from "./constants";

const socket = (function () {
  let instance;

  async function createInstance() {
    return new Promise((resolve, reject) => {
      const s = new WebSocket(websocketLink);
      s.onopen = function (event) {
        resolve(s);
      };
    });
  }

  return {
    getInstance: async function () {
      if (!instance) {
        instance = await createInstance();
      }
      return instance;
    },

    hasInstance: function () {
      return instance ? true : false;
    },
  };
})();

export default socket;
