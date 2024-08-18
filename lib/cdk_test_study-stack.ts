import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class CdkTestStudyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ec2.Vpc(this, 'CdkTestStudyVpc', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'CdkTestStudyPrivate',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED
        }
      ]
    });

    const Bucket = new s3.Bucket(this, 'CdkTestStudyBucket1', {
      bucketName: 'hogehoge',
      enforceSSL: true,
      objectLockEnabled: true,
      versioned: true,
    });

    new s3.Bucket(this, 'CdkTestStudyBucket2', {
      objectLockEnabled: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    // S3のBucketNameをoutput
    new cdk.CfnOutput(this, 'S3BucketName', {
      value: Bucket.bucketName,
    });
  }
}
