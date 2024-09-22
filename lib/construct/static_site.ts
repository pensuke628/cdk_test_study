import * as cdk from 'aws-cdk-lib';
import {
  RemovalPolicy,
  Stack,
  StackProps,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfront_origins,
  aws_s3 as s3,
  aws_s3_deployment as s3_deployment,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface StaticSiteProps {
  staticContentPath: string;
}

export class StaticSite extends Construct {
  constructor(scope: Construct, id: string, props: StaticSiteProps) {
    super(scope, id);

    // 静的コンテンツを配置する S3 バケットを作成
    const staticContentBucket = new s3.Bucket(this, 'StaticContentBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // CloudFront ディストリビューションを作成
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // S3BucketOrigin.withOriginAccessControlを使用
        origin: cloudfront_origins.S3BucketOrigin.withOriginAccessControl(staticContentBucket)
      },
    });

    // 静的コンテンツをS3にデプロイ
    new s3_deployment.BucketDeployment(this, 'staticContentDeploy', {
      sources: [s3_deployment.Source.asset(props.staticContentPath)],
      destinationBucket: staticContentBucket,
      distribution: distribution,
      distributionPaths: ['/*'],
    });
  }
}
