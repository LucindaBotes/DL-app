// import { getAllResults } from './hyperledger-client';

// export const getAllResultsHandler = async (event: any) => {
//   try {
//     const assets = await getAllResults();
//     console.log(assets);
//     return {
//       statusCode: 200,
//       body: JSON.stringify(assets),
//     };
//   } catch (error: any) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Failed to get results',
//         error: error.message,
//       }),
//     };
//   }
// };


// // import { getAllAssets } from './hyperledger-client';

// export const getAllAssets = async (event: any) => {
//   try {
//     // const assets = await getAllAssets();
//     const assets = [
//       {
//         id: '1',
//         name: 'Asset 1',
//         value: '100',
//       },
//       {
//         id: '2',
//         name: 'Asset 2',
//         value: '200',
//       },
//     ];
//     console.log('Getting all Assets:', assets);
//     return {
//       statusCode: 200,
//       body: JSON.stringify(assets),
//     };
//   } catch (error: any) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Failed to get assets',
//         error: error.message,
//       }),
//     };
//   }
// };

import { Gateway, Wallets } from 'fabric-network'
const ccp = require('./connection-profile.json'); // Adjust the path to your connection profile

interface Asset {
  Id: string;
  [key: string]: any; // Define other asset properties as needed
}

export const getAllResults = async (): Promise<Asset[]> => {
  let gateway = new Gateway();
  try {
    const wallet = await Wallets.newInMemoryWallet();
    await gateway.connect(ccp, {
      wallet: wallet,
      identity: ccp.organizations.Org1.mspid,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('ws-supplier-channel');
    const contract = network.getContract('asset');

    // Evaluate the transaction to get all assets
    const result = await contract.evaluateTransaction('getAllResults');

    // Parse the result to get an array of assets
    const assets: Asset[] = JSON.parse(result.toString());

    return assets;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to get all assets: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
    return [];
  } finally {
    // Ensure the gateway is disconnected
    if (gateway) {
      await gateway.disconnect();
    }
  }
};