const functions = require("firebase-functions");
const aws = require("aws-sdk");

exports.presignedPutUrl = functions.https.onRequest((req, res) => {
  // return cors(() => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  res.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );


  if (req.method === "OPTIONS") {
    return res.end();
  }
  const body = req.body;

  try {
    const spaces = new aws.S3({
      endpoint: new aws.Endpoint(functions.config().spaces.url),
      accessKeyId: functions.config().spaces.keyid,
      secretAccessKey: functions.config().spaces.secretkey,
    });
    const signedUrls = [];
    for (const file of body.files) {
      const params = {
        Bucket: "kolib",
        Key: file.path,
        Expires: 30, // Expires in 30 seconds
        ContentType: file.fileType,
        ACL: "public-read", // Remove this to make the file private
      };
      const signedUrl = spaces.getSignedUrl("putObject", params);
      signedUrls.push(signedUrl);
    }

    return res.json({signedUrls});
  } catch (err) {
    return res.send(err);
  }
  // });
});
