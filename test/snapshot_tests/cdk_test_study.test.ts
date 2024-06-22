import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkTestStudyStack } from '../../lib/cdk_test_study-stack';

// snapshot test
describe('CdkTestStudyStack', () => {
  test("snapshot", () => {
    const app = new cdk.App();
    const stack = new CdkTestStudyStack(app, "MyTestStack");
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  })
})
