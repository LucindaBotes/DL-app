import { Gateway, Wallets } from 'fabric-network'
const ccp = require('./connection-profile.json'); // Adjust the path to your connection profile

export const deleteAsset = async (assetId: string): Promise<void> => {
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

    // Submit the transaction to delete the asset
    await contract.submitTransaction('deleteAsset', assetId);

    console.log('Asset deleted successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to delete asset: ${error.message}`);
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
