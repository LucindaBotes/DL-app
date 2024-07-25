import { Gateway, Wallets } from 'fabric-network'
const ccp = require('./connection-profile.json'); // Adjust the path to your connection profile

interface Asset {
  Id: string;
  [key: string]: any; // Add other asset properties as needed
}

export const createAsset = async (asset: any): Promise<void> => {
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

    // Submit the transaction to create the asset
    await contract.submitTransaction('createAsset', JSON.stringify(asset));

    console.log('Asset created successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to create asset: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
  } finally {
    // Ensure the gateway is disconnected
    if (gateway) {
      await gateway.disconnect();
    }
  }
};
