import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { NagSuppressions } from 'cdk-nag';

export class CdkTestStudyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'CdkTestStudyVpc', {
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
    // nagに対応する場合、VpcFlowLogを追加する
    // new ec2.FlowLog(this, 'CdkTestStudyVpcFlowLog', {
    //   resourceType: ec2.FlowLogResourceType.fromVpc(vpc),
    // });
    // ルールを抑制した場合、suppressionを追加する
    NagSuppressions.addResourceSuppressions(vpc, [
      {
        id: 'AwsSolutions-VPC7',
        reason: 'This is a test'
      },
    ]);
  }
}
