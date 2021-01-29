const functions = require("firebase-functions");
const aws = require("aws-sdk");

exports.presignedGetUrl = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "https://kolib-1.web.app");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "https://kolib-1.web.app");

  if (req.method === "OPTIONS") {
    return res.end();
  }
  const body = req.body;

  const spaces = new aws.S3({
    endpoint: new aws.Endpoint(functions.config().spaces.url),
    accessKeyId: functions.config().spaces.keyid,
    secretAccessKey: functions.config().spaces.secretkey,
  });


  const params = {
    Bucket: "kolib",
    Key: body.fileName,
    Expires: 30, // Expires in 3 minutes
    ContentType: body.fileType,
    ACL: "public-read", // Remove this to make the file private
  };

  const signedUrl = spaces.getSignedUrl("getObject", params);

  res.json({signedUrl});
});

exports.presignedPutUrl = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "https://kolib-1.web.app");
  res.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "https://kolib-1.web.app");

  if (req.method === "OPTIONS") {
    return res.end();
  }
  const body = req.body;

  const spaces = new aws.S3({
    endpoint: new aws.Endpoint(functions.config().spaces.url),
    accessKeyId: functions.config().spaces.keyid,
    secretAccessKey: functions.config().spaces.secretkey,
  });


  const params = {
    Bucket: "kolib",
    Key: body.fileName,
    Expires: 30, // Expires in 3 minutes
    ContentType: body.fileType,
    ACL: "public-read", // Remove this to make the file private
  };

  const signedUrl = spaces.getSignedUrl("putObject", params);

  res.json({signedUrl});
});
