// // import { getAssetHistory } from './hyperledger-client';

// export const getAssetHistory = async (event: any) => {
//   try {
//     const { assetId } = event.pathParameters;
//     // const history = await getAssetHistory(assetId);
//     console.log('Getting Asset History:', assetId);
//     const history = [
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
//     console.log(history)
//     return {
//       statusCode: 200,
//       body: JSON.stringify(history),
//     };
//   } catch (error: any) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Failed to get asset history',
//         error: error.message,
//       }),
//     };
//   }
// };

import { Gateway, Wallets } from 'fabric-network'
const ccp = require('./connection-profile.json'); // Adjust the path to your connection profile

interface AssetHistory {
  txId: string;
  timestamp: string;
  asset: any; // Define asset structure as needed
}

export const getAssetHistory = async (assetId: string): Promise<AssetHistory[]> => {
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

    // Evaluate the transaction to get asset history
    const result = await contract.evaluateTransaction('GetAssetHistory', assetId);

    // Parse the result to get an array of asset history records
    const historyRecords: AssetHistory[] = JSON.parse(result.toString());

    return historyRecords;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to get asset history: ${error.message}`);
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