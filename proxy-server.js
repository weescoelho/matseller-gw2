const cors_proxy = require("cors-anywhere");

const host = "localhost";
const port = 8080;

cors_proxy
  .createServer({
    originWhitelist: [], // Permite qualquer origem durante desenvolvimento
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: ["cookie", "cookie2"],
  })
  .listen(port, host, function () {
    console.log("Servidor proxy rodando em: " + host + ":" + port);
  });
