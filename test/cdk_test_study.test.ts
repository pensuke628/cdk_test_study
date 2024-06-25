import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkTestStudyStack } from '../lib/cdk_test_study-stack';

// assertion test
describe('CdkTestStudyStack', () => {
  let template: Template;

  beforeAll(() => {
    const app = new cdk.App();
    const stack = new CdkTestStudyStack(app, "MyTestStack");
    // テンプレートの⽣成
    template = Template.fromStack(stack);
  });

  // snapshot
  test('snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  })

  // VPC
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

  // Subnet
  // テストを2つ書く場合
  // test('Subnetが2つ存在すること', () => {
  //   template.resourceCountIs("AWS::EC2::Subnet", 2);
  // });

  // test('SubnetはすべてPrivate Subnetであること', () => {
  //   template.allResourcesProperties("AWS::EC2::Subnet",
  //     {
  //       MapPublicIpOnLaunch: false,
  //     }
  //   );
  // });

  // 1つのテストにまとめる場合
  test("Private Subnetが2つ存在する", () => {
    template.resourcePropertiesCountIs("AWS::EC2::Subnet", {
      MapPublicIpOnLaunch: false,
    }, 2);
  });

  // FlowLog
  // nagに対応する場合、VpcFlowLogを追加する
  // test ('VpcFlowLogが1つ存在すること', () => {
  //   template.resourcePropertiesCountIs("AWS::EC2::FlowLog", {
  //     ResourceType: "VPC",
  //   }, 1);
  // });
})
