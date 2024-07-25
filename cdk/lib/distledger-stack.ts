import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

// TODO: update the VPC lookup to match your specific VPC ID or tags

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

    // Lookup existing VPC by ID or tags
    const vpc = ec2.Vpc.fromLookup(this, 'ExistingVpc', {
      vpcId: 'vpc-04005540bf71e95a6', 
      isDefault: false, 
      tags: { Name: 'workshop-retailer-vpc' },
    });

    // Lambda Security Group
    const lambdaSG = new ec2.SecurityGroup(this, 'lambdaSG', {
      vpc,
      allowAllOutbound: true,
      securityGroupName: `distLedger-lambda-security-group-distLedgerEnv`,
    });
    lambdaSG.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.allTcp(),
      'Allow internal VPC traffic'
    );

    const lambdasDir = 'lambdas/';

    const createLambdaFunction = (id: string, handler: string) => new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: `${handler}.handler`,
      code: lambda.Code.fromAsset(lambdasDir),
      securityGroups: [lambdaSG],
      role: lambdaRole,
      vpc: vpc,
    });

    const initLedgerFunction = createLambdaFunction('InitLedgerFunction', 'initLedger');
    const createAssetFunction = createLambdaFunction('CreateAssetFunction', 'createAsset');
    const readAssetFunction = createLambdaFunction('ReadAssetFunction', 'readAsset');
    const updateAssetFunction = createLambdaFunction('UpdateAssetFunction', 'updateAsset');
    const deleteAssetFunction = createLambdaFunction('DeleteAssetFunction', 'deleteAsset');
    const assetExistsFunction = createLambdaFunction('AssetExistsFunction', 'assetExists');
    const transferAssetFunction = createLambdaFunction('TransferAssetFunction', 'transferAsset');
    const getAllResultsFunction = createLambdaFunction('GetAllResultsFunction', 'getAllResults');
    const getAllAssetsFunction = createLambdaFunction('GetAllAssetsFunction', 'getAllAssets');
    const getAssetHistoryFunction = createLambdaFunction('GetAssetHistoryFunction', 'getAssetHistory');
    const getQueryResultForQueryStringFunction = createLambdaFunction('GetQueryResultForQueryStringFunction', 'getQueryResultForQueryString');
    const getAssetsByOwnerFunction = createLambdaFunction('GetAssetsByOwnerFunction', 'getAssetsByOwner');

    const api = new apigateway.RestApi(this, 'HyperledgerApi', {
      restApiName: 'Hyperledger Service',
      description: 'This service serves Hyperledger functions.',
    });

    // Helper function to add method to resource
    const addMethodToResource = (resource: apigateway.IResource, method: string, lambdaFunction: lambda.Function) => {
      resource.addMethod(method, new apigateway.LambdaIntegration(lambdaFunction));
    };

    // Create Asset
    const assetsResource = api.root.addResource('assets');
    addMethodToResource(assetsResource, 'POST', createAssetFunction);

    // Read Asset
    const singleAssetResource = assetsResource.addResource('{assetId}');
    addMethodToResource(singleAssetResource, 'GET', readAssetFunction);

    // Update Asset
    addMethodToResource(singleAssetResource, 'PUT', updateAssetFunction);

    // Delete Asset
    addMethodToResource(singleAssetResource, 'DELETE', deleteAssetFunction);

    // Get All Assets
    const getAllAssetsResource = assetsResource.addResource('all');
    addMethodToResource(getAllAssetsResource, 'GET', getAllAssetsFunction);

    // Get Asset History
    const assetHistoryResource = singleAssetResource.addResource('history');
    addMethodToResource(assetHistoryResource, 'GET', getAssetHistoryFunction);

    // Get Assets by Owner
    const assetsByOwnerResource = api.root.addResource('owner').addResource('{ownerId}');
    addMethodToResource(assetsByOwnerResource, 'GET', getAssetsByOwnerFunction);

    // Transfer Asset
    const transferAssetResource = singleAssetResource.addResource('transfer');
    addMethodToResource(transferAssetResource, 'POST', transferAssetFunction);

    // Get All Results
    const resultsResource = api.root.addResource('results');
    addMethodToResource(resultsResource, 'GET', getAllResultsFunction);

    // Get Query Result for Query String
    const queryResource = assetsResource.addResource('query');
    addMethodToResource(queryResource, 'GET', getQueryResultForQueryStringFunction);

    // Asset Exists
    const assetExistsResource = singleAssetResource.addResource('exists');
    addMethodToResource(assetExistsResource, 'GET', assetExistsFunction);

    // Init Ledger
    const initLedgerResource = api.root.addResource('ledger').addResource('init');
    addMethodToResource(initLedgerResource, 'POST', initLedgerFunction);
  }
}
