import AWS = require("aws-sdk")

import {config} from "./config/config"

// NB: When deployed to AWS EC2, this configuration will be done automatically by AWS.
if (config.deployedWith === "eks") {
  const credentials = new AWS.Credentials ({
    accessKeyId: config.deployedWithAccessKeyId,
    secretAccessKey: config.deployedWithSecretAccessKey,
  })
  AWS.config.credentials = credentials
} else if (config.deployedWith !== "ec2") {
  const credentials = new AWS.SharedIniFileCredentials({profile: config.awsProfile})
  AWS.config.credentials = credentials
}

export const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: config.awsRegion,
  params: {Bucket: config.awsMediaBucket},
})

/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getGetSignedUrl(key: string): string{

  const signedUrlExpireSeconds = 60 * 5

  const url = s3.getSignedUrl("getObject", {
    Bucket: config.awsMediaBucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  })

  return url
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getPutSignedUrl(key: string): string {
  const signedUrlExpireSeconds = 60 * 5

  const url = s3.getSignedUrl("putObject", {
    Bucket: config.awsMediaBucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  })

  return url
}
