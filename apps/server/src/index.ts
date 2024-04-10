import path from "path";
import express from "express";
import { OAuth2Client } from "google-auth-library";

const projectRoot = path.resolve(__dirname, "..");

const app = express();

const router = express.Router();

// Set static folder
app.use(express.static(path.resolve(projectRoot, "src", "views")));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

router.post("/google", async (req, res) => {
  res.header("HX-Redirect", "https://www.google.com/");
  return res.send();
});

// /* GET users listing. */
// router.post("/", async function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Referrer-Policy", "no-referrer-when-downgrade");
//   const redirectURL = "http://127.0.0.1:3000/oauth";

//   const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectURL);

//   // Generate the url that will be used for the consent dialog.
//   const authorizeUrl = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: "https://www.googleapis.com/auth/userinfo.profile  openid ",
//     prompt: "consent",
//   });

//   res.json({ url: authorizeUrl });
// });

app.use("/oauth", router);

// Start the server
app.listen(8989, () => {
  console.log("Server listening on port 8989");
});
