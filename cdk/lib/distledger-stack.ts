import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

// TODO: update vpc to use existing vpc and security group

export class DistLedgerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda Role
    const lambdaRole = new iam.Role(this, 'lambdaRole', {
      roleName: `distLedger-lambda-role-distLedger`,
      description: `Lambda role for distLedger`,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'),
        iam.ManagedPolicy.fromManagedPolicyArn(
          this,
          'lambdaVPCAccessPolicy',
          'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
        ),
      ],
    });

    // Attach inline policies to Lambda role
    lambdaRole.attachInlinePolicy(
      new iam.Policy(this, 'lambdaExecutionAccess', {
        policyName: 'lambdaExecutionAccess',
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: ['*'],
            actions: [
              'logs:CreateLogGroup',
              'logs:CreateLogStream',
              'logs:DescribeLogGroups',
              'logs:DescribeLogStreams',
              'logs:PutLogEvents',
            ],
          }),
        ],
      })
    );

    const vpc = new ec2.Vpc(this, 'CDKVpc', {
      cidr: '10.0.0.0/16',
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'distLedger-Public-subnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'distLedger-Private-subnet',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Lambda Security Group
    const lambdaSG = new ec2.SecurityGroup(this, 'lambdaSG', {
      vpc,
      allowAllOutbound: true,
      securityGroupName: `distLedger-lambda-security-group-distLedgerEnv`,
    });
    lambdaSG.addIngressRule(
      ec2.Peer.ipv4('10.0.0.0/16'),
      ec2.Port.allTcp(),
      'Allow internal VPC traffic'
    );

    // const lambda_handler = new NodejsFunction(this, 'lamda-handler', {
    //   handler: 'distLedgerHandler',
    //   entry: './lambda-handler/lambda-handler.ts',
    //   runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
    //   securityGroups: [lambdaSG],
    //   role: lambdaRole,
    //   vpc: vpc,
    // });

    // const apiGateway = new cdk.aws_apigateway.LambdaRestApi(
    //   this,
    //   'api-gateway',
    //   {
    //     handler: lambda_handler,
    //     deploy: true,
    //     proxy: true,
    //     binaryMediaTypes: ['*/*'],
    //     deployOptions: {
    //       stageName: 'api-gateway',
    //     },
    //   }
    // );

    const lambdasDir = 'lambdas/';

    const initLedgerFunction = new lambda.Function(this, 'InitLedgerFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'initLedger.handler',
      code: lambda.Code.fromAsset(lambdasDir),
      securityGroups: [lambdaSG],
      role: lambdaRole,
      vpc: vpc,
    });

    const createAssetFunction = new lambda.Function(
      this,
      'CreateAssetFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'createAsset.handler',
        code: lambda.Code.fromAsset(lambdasDir),
        securityGroups: [lambdaSG],
        role: lambdaRole,
        vpc: vpc,
      }
    );

    const readAssetFunction = new lambda.Function(this, 'ReadAssetFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'readAsset.handler',
      code: lambda.Code.fromAsset(lambdasDir),
      securityGroups: [lambdaSG],
      role: lambdaRole,
      vpc: vpc,
    });

    const updateAssetFunction = new lambda.Function(
      this,
      'UpdateAssetFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'updateAsset.handler',
        code: lambda.Code.fromAsset(lambdasDir),
        securityGroups: [lambdaSG],
        role: lambdaRole,
        vpc: vpc,
      }
    );

    const deleteAssetFunction = new lambda.Function(
      this,
      'DeleteAssetFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'deleteAsset.handler',
        code: lambda.Code.fromAsset(lambdasDir),
        securityGroups: [lambdaSG],
        role: lambdaRole,
        vpc: vpc,
      }
    );

    const assetExistsFunction = new lambda.Function(
      this,
      'AssetExistsFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'assetExists.handler',
        code: lambda.Code.fromAsset(lambdasDir),
        securityGroups: [lambdaSG],
        role: lambdaRole,
        vpc: vpc,
      }
    );

    const transferAssetFunction = new lambda.Function(
      this,
      'TransferAssetFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'transferAsset.handler',
        code: lambda.Code.fromAsset(lambdasDir),
        securityGroups: [lambdaSG],
        role: lambdaRole,
        vpc: vpc,
      }
    );

    const getAllResultsFunction = new lambda.Function(
      this,
      'GetAllResultsFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'getAllResults.handler',
        code: lambda.Code.fromAsset(lambdasDir),
        securityGroups: [lambdaSG],
        role: lambdaRole,
        vpc: vpc,
      }
    );

    const getAllAssetsFunction = new lambda.Function(
      this,
      'GetAllAssetsFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'getAllAssets.handler',
        code: lambda.Code.fromAsset(lambdasDir),
        securityGroups: [lambdaSG],
        role: lambdaRole,
        vpc: vpc,
      }
    );

    const getAssetHistoryFunction = new lambda.Function(
      this,
      'GetAssetHistoryFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'getAssetHistory.handler',
        code: lambda.Code.fromAsset(lambdasDir),
        securityGroups: [lambdaSG],
        role: lambdaRole,
        vpc: vpc,
      }
    );

    const getQueryResultForQueryStringFunction = new lambda.Function(
      this,
      'GetQueryResultForQueryStringFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'getQueryResultForQueryString.handler',
        code: lambda.Code.fromAsset(lambdasDir),
        securityGroups: [lambdaSG],
        role: lambdaRole,
        vpc: vpc,
      }
    );

    const getAssetsByOwnerFunction = new lambda.Function(
      this,
      'GetAssetsByOwnerFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'getAssetsByOwner.handler',
        code: lambda.Code.fromAsset(lambdasDir),
        securityGroups: [lambdaSG],
        role: lambdaRole,
        vpc: vpc,
      }
    );

    const api = new apigateway.RestApi(this, 'HyperledgerApi', {
      restApiName: 'Hyperledger Service',
      description: 'This service serves Hyperledger functions.',
    });

    // Create Asset
    const assetsResource = api.root.addResource('assets');
    const createAssetIntegration = new apigateway.LambdaIntegration(
      createAssetFunction
    );
    assetsResource.addMethod('POST', createAssetIntegration);

    // Read Asset
    const singleAssetResource = assetsResource.addResource('{assetId}');
    const readAssetIntegration = new apigateway.LambdaIntegration(
      readAssetFunction
    );
    singleAssetResource.addMethod('GET', readAssetIntegration);

    // Update Asset
    const updateAssetIntegration = new apigateway.LambdaIntegration(
      updateAssetFunction
    );
    singleAssetResource.addMethod('PUT', updateAssetIntegration);

    // Delete Asset
    const deleteAssetIntegration = new apigateway.LambdaIntegration(
      deleteAssetFunction
    );
    singleAssetResource.addMethod('DELETE', deleteAssetIntegration);

    // Get All Assets
    const getAllAssetsResource = assetsResource.addResource('all');
    const getAllAssetsIntegration = new apigateway.LambdaIntegration(
      getAllAssetsFunction
    );
    getAllAssetsResource.addMethod('GET', getAllAssetsIntegration);

    // Get Asset History
    const assetHistoryResource = singleAssetResource.addResource('history');
    const getAssetHistoryIntegration = new apigateway.LambdaIntegration(
      getAssetHistoryFunction
    );
    assetHistoryResource.addMethod('GET', getAssetHistoryIntegration);

    // Get Assets by Owner
    const assetsByOwnerResource = api.root
      .addResource('owner')
      .addResource('{ownerId}');
    const getAssetsByOwnerIntegration = new apigateway.LambdaIntegration(
      getAssetsByOwnerFunction
    );
    assetsByOwnerResource.addMethod('GET', getAssetsByOwnerIntegration);

    // Transfer Asset
    const transferAssetResource = singleAssetResource.addResource('transfer');
    const transferAssetIntegration = new apigateway.LambdaIntegration(
      transferAssetFunction
    );
    transferAssetResource.addMethod('POST', transferAssetIntegration);

    // Get All Results
    const resultsResource = api.root.addResource('results');
    const getAllResultsIntegration = new apigateway.LambdaIntegration(
      getAllResultsFunction
    );
    resultsResource.addMethod('GET', getAllResultsIntegration);

    // Get Query Result for Query String
    const queryResource = assetsResource.addResource('query');
    const getQueryResultForQueryStringIntegration =
      new apigateway.LambdaIntegration(getQueryResultForQueryStringFunction);
    queryResource.addMethod('GET', getQueryResultForQueryStringIntegration);

    // Asset Exists
    const assetExistsResource = singleAssetResource.addResource('exists');
    const assetExistsIntegration = new apigateway.LambdaIntegration(
      assetExistsFunction
    );
    assetExistsResource.addMethod('GET', assetExistsIntegration);

    // Init Ledger
    const initLedgerResource = api.root
      .addResource('ledger')
      .addResource('init');
    const initLedgerIntegration = new apigateway.LambdaIntegration(
      initLedgerFunction
    );
    initLedgerResource.addMethod('POST', initLedgerIntegration);
  }
}
