const AWS = require('aws-sdk');
const uuid = require('uuid');
require('dotenv').config()
const parseFormData = require("parse-formdata");
const fs=require("fs")
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path)
  
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: fileStream,
      Key: file.filename
    }
  
    return s3.upload(uploadParams).promise()
  }
function generatePresignedUrl(req, res) {
  const { contentType } = req.query;
  const key = `${uuid.v4()}.${contentType.split('/')[1]}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', params, (error, url) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      res.json({ key, url });
    }
  });
}

function extractFormDataFromRequestBody(req) {
    return new Promise(function (resolve, reject) {
      parseFormData(req, function (err, data) {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve(data);
      });
    });
  }
  async function uploadFileToS3(o, deleteFile = true) {
    const { filename, Key, contentType } = await o;
    console.log("filename", filename);
    console.log("Key", Key);
    console.log("contentType", contentType);
  
    const filepath = `media/${Key}`;
    console.log("filepath: " + filepath);
  
    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      Body: fs.readFileSync(filepath),
      ACL: "public-read",
      ContentType: contentType,
    };
    try {
      var result = await new AWS.S3({ apiVersion: "2006-03-01" })
        .putObject(params)
        .promise();
      console.log(
        `Successfully uploaded data to S3: ${params.Bucket}/${params.Key}\nResult:`
      );
      console.log(result);
      if (deleteFile)
        fs.unlink(filepath, err =>
          err ? console.error("File delete failed: " + err) : ""
        );
      return "https://amandb.s3.amazonaws.com/" + filename;
    } catch (e) {
      console.log("S3 upload failed with error: " + e);
    }
    return null;
  }
  function downloadFileDataToFile(fileData, { dir, filename }) {
    return new Promise(function (resolve, reject) {
      try {
        const Key = `${dir}/${filename}`;
        const filepath = `media/${dir}/${filename}`;
        const ext = fileData.filename.split(".")[1];
        if (!fs.existsSync(`media/${dir}`)) fs.mkdirSync(`media/${dir}`);
        const ws = fileData.stream.pipe(fs.createWriteStream(filepath));
        ws.on("finish", async () => {
          try {
            resolve({ Key, contentType: mime.types[ext] || "application/octet-stream" });
          } catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
module.exports = { generatePresignedUrl,extractFormDataFromRequestBody,downloadFileDataToFile,uploadFile };
