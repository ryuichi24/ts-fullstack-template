console.log("CHILD CREATED ", process.pid);
process.on("message", (msg) => {
  console.log({ msg, pid: process.pid });
});
