import net from "net";

export function findFreePort() {
  return new Promise<number>((res, rej) => {
    console.log("Finding a free port...");
    const srv = net.createServer();
    srv.listen(0, () => {
      const port = (srv.address() as net.AddressInfo).port;
      srv.close(() => {
        console.log("Found a free port: ", port);
        res(port);
      });
    });

    srv.on("error", (stream) => {
      rej(stream);
    });
  });
}
