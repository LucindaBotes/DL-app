import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
// import * as managedblockchain from 'aws-cdk-lib/aws-managedblockchain';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const network = new managedblockchain.CfnMember(this, 'MyCfnMember' {
    //   memberConfiguration: {
    //     name: 'MyMember',
    //     networkId: 'n-abc123',
    //     frameworkConfiguration: {
    //       fabric: {
    //         adminPassword: 'MyPassword'
    //       }
    //     }
    //   }
    // });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
