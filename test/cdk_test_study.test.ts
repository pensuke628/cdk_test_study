import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkTestStudyStack } from '../lib/cdk_test_study-stack';

const app = new cdk.App();
const stack = new CdkTestStudyStack(app, "MyTestStack");
const template = Template.fromStack(stack);

// snapshot
test('snapshot', () => {
  expect(template.toJSON()).toMatchSnapshot();
})

// assertion test

// ------------------------------
// VPC
// ------------------------------
test('VPCが1つ存在すること', () => {
  template.resourceCountIs("AWS::EC2::VPC", 1);
});

test('VPCのCIDRが10.0.0.0/16であること', () => {
  template.hasResourceProperties("AWS::EC2::VPC", 
    {
      CidrBlock: "10.0.0.0/16",
    }
  );
});

// ------------------------------
// Subnet
// ------------------------------

test("Private Subnetが2つ存在する", () => {
  template.resourcePropertiesCountIs("AWS::EC2::Subnet", {
    MapPublicIpOnLaunch: false,
  }, 2);
});

// ------------------------------
// Propertyをcheckするtest
// ------------------------------
test("ObjectLockを有効にしているS3バケットが存在すること", () => {
  template.hasResourceProperties("AWS::S3::Bucket", {
    BucketName: "hogehoge"
  });
});

test("全てのS3バケットでObjectLockが有効になっていること", () => {
  template.allResourcesProperties("AWS::S3::Bucket", {
    ObjectLockEnabled: true,
  });
});

// ------------------------------
// Property以外をcheckするtest
// ------------------------------
test("削除ポリシーがRetainでS3バケットが存在すること", () => {
  template.hasResource("AWS::S3::Bucket", {
    DeletionPolicy: "Retain",
  });
});

test("全てのS3バケットの削除ポリシーがRetainであること", () => {
  template.allResources("AWS::S3::Bucket", {
    DeletionPolicy: "Retain",
  });
});

// ------------------------------
// リソース数をcheckするtest
// ------------------------------
test("作成されるS3バケットが2つであること", () => {
  template.resourceCountIs("AWS::S3::Bucket", 2);
});

test("ObjectLockを有効にしているS3バケットが2つ存在すること", () => {
  template.resourcePropertiesCountIs("AWS::S3::Bucket", {
    ObjectLockEnabled: true,
  }, 2);
});

test("findResourcesの出力内容を確認する", () => {
  const s3 = template.findResources("AWS::S3::Bucket", {
    Properties: {
      BucketName: "hogehoge",
    },
  });
  // console.log(s3);
  // CdkTestStudyBucket13535E829: {
  //   Type: 'AWS::S3::Bucket',
  //   Properties: {
  //     BucketName: 'hogehoge',
  //     ObjectLockEnabled: true,
  //     VersioningConfiguration: [Object]
  //   },
  //   UpdateReplacePolicy: 'Retain',
  //   DeletionPolicy: 'Retain'
  // }
});

test("S3のBucketNameをOutputしていること", () => {
  const s3 = template.findResources("AWS::S3::Bucket", {
    Properties: {
      BucketName: "hogehoge",
    },
  });
  template.hasOutput('S3BucketName', {
    Value: { 
      Ref: Object.keys(s3)[0]
    }
  });
});
