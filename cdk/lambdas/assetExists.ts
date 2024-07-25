import { Gateway, Wallets } from 'fabric-network'
const ccp = require('./connection-profile.json'); // Adjust the path to your connection profile

export const assetExists = async (assetId: string): Promise<boolean> => {
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

    // Evaluate the transaction to get the asset
    const response = await contract.evaluateTransaction('GetAssetById', assetId);

    // Check if the asset exists
    if (response && response.length > 0) {
      const asset = JSON.parse(response.toString());
      return asset !== null;
    } else {
      return false;
    }
  } catch (error: unknown) { // Specify the type of error
    if (error instanceof Error) {
      console.error(`Failed to check asset existence: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
    return false;
  } finally {
    // Ensure the gateway is disconnected
    if (gateway) {
      await gateway.disconnect();
    }
  }
};
