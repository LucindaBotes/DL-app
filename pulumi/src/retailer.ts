import * as aws from "@pulumi/aws";

import { adminRole } from './permissions'


const initializeDependencies = `#!/bin/bash
  sudo yum update -y
  sudo yum install -y telnet jq git libtool
  wget https://dl.google.com/go/go1.16.7.linux-amd64.tar.gz -O go1.16.7.linux-amd64.tar.gz
  tar -xzf go1.16.7.linux-amd64.tar.gz --overwrite
  sudo rsync -a go /usr/local
  sudo yum install libtool-ltdl-devel -y
`

const launchTemplate = new aws.ec2.LaunchTemplate('ws-supplier-ec2-launchTemplate', {
  instanceType: 't2.micro',
  imageId: 'ami-05842291b9a0bd79f', 
  keyName: 'ws-pair',
  userData: Buffer.from(initializeDependencies).toString('base64'),
})

const vpc = new aws.ec2.Vpc('ws-retailer-client-vpc', {
  cidrBlock: '10.1.0.0/16',

  tags: {
    Name: 'ws-retailer-client-vpc',
    Project: 'ws',
  },
})

const igw = new aws.ec2.InternetGateway('ws-retailer-client-igw', {
  vpcId: vpc.id,
  
  tags: {
    Name: 'ws-retailer-client-igw',
    Project: 'ws',
  },
})

const subnet = new aws.ec2.Subnet('ws-retailer-client-subnet', {
  vpcId: vpc.id,
  cidrBlock: '10.1.1.0/24',
  mapPublicIpOnLaunch: true,

  tags: {
    Name: 'ws-retailer-client-subnet',
    Project: 'ws',
  },
})

const rt = new aws.ec2.RouteTable('ws-retailer-client-rt', {
  vpcId: vpc.id,
  routes: [
    {
      cidrBlock: '0.0.0.0/0',
      gatewayId: igw.id,
    },
  ],

  tags: {
    Project: 'ws',
  },
})

const rta = new aws.ec2.RouteTableAssociation('ws-retailer-client-rta', {
  subnetId: subnet.id,
  routeTableId: rt.id,
})

const internalSg = new aws.ec2.SecurityGroup('ws-retailer-internal-sg', {
  vpcId: vpc.id,
  description: 'Allows all traffic',
  ingress: [
    {
      protocol: '-1',
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ['0.0.0.0/0'],
    }
  ],
  egress: [
    {
      protocol: '-1',
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ['0.0.0.0/0'],
    }
  ],

  tags: {
    Project: 'ws',
  },
})

// const sshSg = new aws.ec2.SecurityGroup('ws-retailer-ssh-sg', {
//   vpcId: vpc.id,
//   description: 'Allows SSH access',
//   ingress: [
//     {
//       protocol: 'tcp',
//       fromPort: 22,
//       toPort: 22,
//       cidrBlocks: ['0.0.0.0/0'],
//     }
//   ],
//   egress: [
//     {
//       protocol: '-1',
//       fromPort: 0,
//       toPort: 0,
//       cidrBlocks: ['0.0.0.0/0'],
//     }
//   ],

//   tags: {
//     Project: 'ws',
//   },
// })

const instanceProfile = new aws.iam.InstanceProfile('ws-retailer-instance-profile', {
  role: adminRole.name,
})

const instance = new aws.ec2.Instance('ws-retailer-ec2', {
  vpcSecurityGroupIds: [internalSg.id],
  subnetId: subnet.id,
  iamInstanceProfile: instanceProfile,
  launchTemplate: {
    id: launchTemplate.id,
    version: '$Latest',
  },

  tags: {
    Name: 'ws-retailer-ec2',
    Project: 'ws',
  },
})