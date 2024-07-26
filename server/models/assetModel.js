import { Gateway, Wallets } from 'fabric-network';
import { AssetTransfer } from '../../chaincode/supplychain/lib/supplyChain.js';

const ccp = {
  name: 'Network',
  version: '1.1',
  channels: {
    'ws-supplier-channel': {
      orderers: [
        'orderer.n-e6kqya3ve5hmdf2bnv4bfcnkga.managedblockchain.eu-west-1.amazonaws.com:30001',
      ],
      peers: [
        'nd-n3kcx2gymnaxxjtey3agpaprw4.m-rf4xjnqfsrhzjcryku3tl3dbe4.n-e6kqya3ve5hmdf2bnv4bfcnkga.managedblockchain.eu-west-1.amazonaws.com',
      ],
    },
  },
  organizations: {
    Org1: {
      mspid: 'm-RF4XJNQFSRHZJCRYKU3TL3DBE4',
      peers: [
        'nd-n3kcx2gymnaxxjtey3agpaprw4.m-rf4xjnqfsrhzjcryku3tl3dbe4.n-e6kqya3ve5hmdf2bnv4bfcnkga.managedblockchain.eu-west-1.amazonaws.com',
      ],
    },
  },
  orderers: {
    'orderer.n-e6kqya3ve5hmdf2bnv4bfcnkga.managedblockchain.eu-west-1.amazonaws.com':
      {
        url: 'grpcs://orderer.n-e6kqya3ve5hmdf2bnv4bfcnkga.managedblockchain.eu-west-1.amazonaws.com:30001',
        grpcOptions: {
          'ssl-target-name-override':
            'orderer.n-e6kqya3ve5hmdf2bnv4bfcnkga.managedblockchain.eu-west-1.amazonaws.com',
        },
        tlsCACerts: {
          path: '/admin-msp/cacerts/ca-m-rf4xjnqfsrhzjcryku3tl3dbe4-n-e6kqya3ve5hmdf2bnv4bfcnkga-managedblockchain-eu-west-1-amazonaws-com-30002.pem',
        },
      },
  },
  peers: {
    'nd-n3kcx2gymnaxxjtey3agpaprw4.m-rf4xjnqfsrhzjcryku3tl3dbe4.n-e6kqya3ve5hmdf2bnv4bfcnkga.managedblockchain.eu-west-1.amazonaws.com':
      {
        url: 'grpcs://nd-n3kcx2gymnaxxjtey3agpaprw4.m-rf4xjnqfsrhzjcryku3tl3dbe4.n-e6kqya3ve5hmdf2bnv4bfcnkga.managedblockchain.eu-west-1.amazonaws.com:30003',
        grpcOptions: {
          'ssl-target-name-override':
            'nd-n3kcx2gymnaxxjtey3agpaprw4.m-rf4xjnqfsrhzjcryku3tl3dbe4.n-e6kqya3ve5hmdf2bnv4bfcnkga.managedblockchain.eu-west-1.amazonaws.com',
        },
        tlsCACerts: {
          path: '/admin-msp/cacerts/ca-m-rf4xjnqfsrhzjcryku3tl3dbe4-n-e6kqya3ve5hmdf2bnv4bfcnkga-managedblockchain-eu-west-1-amazonaws-com-30002.pem',
        },
      },
  },
};

export const createAsset = async (asset) => {
  const gateway = new Gateway();
  try {
    await AssetTransfer.createAsset(JSON.stringify(asset));

    console.log('Asset created successfully');
  } catch (error) {
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

// ? @Lucinda Done
export const updateAsset = async (asset) => {
  const gateway = new Gateway();
  const wallet = await Wallets.newInMemoryWallet();
  const identity = {
    credentials: {
      certificate: certContent,
      privateKey: privateKey,
    },
    mspId: cpp.organizations.Org1.mspid,
    type: 'X.509',
  };

  await wallet.put('appUser', identity);

  await gateway.connect(ccp, {
    wallet: wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork('ws-supplier-channel');
  const contract = network.getContract('ws-supplier-cc');

  const oldAssetBytes = await contract.evaluateTransaction(
    'GetAssetById',
    asset.itemID
  );
  const oldAsset = JSON.parse(oldAssetBytes.toString());

  if (oldAsset) {
    const newAsset = {
      ...oldAsset,
      ...asset,
      origin: JSON.stringify(asset.origin),
      processing: JSON.stringify(asset.processing),
      packaging: JSON.stringify(asset.packaging),
      shipment: JSON.stringify(asset.shipment),
      currentOwner: JSON.stringify(asset.currentOwner),
      transactionHistory: JSON.stringify(asset.transactionHistory),
    };

    await contract.submitTransaction(
      'UpdateAsset',
      newAsset.itemID,
      newAsset.itemName,
      JSON.stringify(newAsset.origin),
      JSON.stringify(newAsset.processing),
      JSON.stringify(newAsset.packaging),
      JSON.stringify(newAsset.shipment),
      JSON.stringify(newAsset.currentOwner),
      JSON.stringify(newAsset.transactionHistory)
    );
  }

  await gateway.disconnect();
};

// TODO: @Rotenda
export const deleteAsset = async (assetId) => {
  const gateway = new Gateway();
  try {
    const wallet = await Wallets.newInMemoryWallet();
    const identity = {
      credentials: {
        certificate: certContent,
        privateKey: privateKey,
      },
      mspId: cpp.organizations.Org1.mspid,
      type: 'X.509',
    };

    await wallet.put('appUser', identity);

    await gateway.connect(ccp, {
      wallet: wallet,
      identity: 'appUser',
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('ws-supplier-channel');
    const contract = network.getContract('ws-supplier-cc');

    // Submit the transaction to delete the asset
    await contract.submitTransaction('DeleteAsset', assetId);

    console.log('Asset deleted successfully');
  } catch (error) {
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

export const getAllAssets = async () => {
  const gateway = new Gateway();
  try {
    const wallet = await Wallets.newInMemoryWallet();
    const identity = {
      credentials: {
        certificate: certContent,
        privateKey: privateKey,
      },
      mspId: cpp.organizations.Org1.mspid,
      type: 'X.509',
    };

    await wallet.put('appUser', identity);

    await gateway.connect(ccp, {
      wallet: wallet,
      identity: 'appUser',
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('ws-supplier-channel');
    const contract = network.getContract('ws-supplier-cc');

    // Evaluate the transaction to get all assets
    const result = await contract.evaluateTransaction('GetAllAssets');

    // Parse the result to get an array of assets
    const assets = JSON.parse(result.toString());

    return assets;
  } catch (error) {
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
//! TODO: @Lucinda
export const transferAsset = async (asset) => {
  const gateway = new Gateway();
  const wallet = await Wallets.newInMemoryWallet();
  const identity = {
    credentials: {
      certificate: certContent,
      privateKey: privateKey,
    },
    mspId: cpp.organizations.Org1.mspid,
    type: 'X.509',
  };

  await wallet.put('appUser', identity);

  await gateway.connect(ccp, {
    wallet: wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork('ws-supplier-channel');
  const contract = network.getContract('ws-supplier-cc');

  await contract.submitTransaction('TransferAsset', JSON.stringify(asset));
  await gateway.disconnect();
};

//! TODO: @Lucinda
export const getAssetsByOwner = async (asset) => {
  const gateway = new Gateway();
  const wallet = await Wallets.newInMemoryWallet();
  const identity = {
    credentials: {
      certificate: certContent,
      privateKey: privateKey,
    },
    mspId: cpp.organizations.Org1.mspid,
    type: 'X.509',
  };

  await wallet.put('appUser', identity);

  await gateway.connect(ccp, {
    wallet: wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork('ws-supplier-channel');
  const contract = network.getContract('ws-supplier-cc');

  await contract.submitTransaction('ChangeAssetOwner', JSON.stringify(asset));
  await gateway.disconnect();
};

export const getAssetHistory = async (assetId) => {
  const gateway = new Gateway();
  try {
    const wallet = await Wallets.newInMemoryWallet();
    const identity = {
      credentials: {
        certificate: certContent,
        privateKey: privateKey,
      },
      mspId: cpp.organizations.Org1.mspid,
      type: 'X.509',
    };

    await wallet.put('appUser', identity);

    await gateway.connect(ccp, {
      wallet: wallet,
      identity: 'appUser',
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('ws-supplier-channel');
    const contract = network.getContract('ws-supplier-cc');

    const result = await contract.evaluateTransaction(
      'GetAssetHistory',
      assetId
    );

    // Parse the result to get an array of asset history records
    const historyRecords = JSON.parse(result.toString());

    return historyRecords;
  } catch (error) {
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

// TODO: @Rotenda
export const getAssetById = async (Id) => {
  const gateway = new Gateway();
  const wallet = await Wallets.newInMemoryWallet();
  const identity = {
    credentials: {
      certificate: certContent,
      privateKey: privateKey,
    },
    mspId: cpp.organizations.Org1.mspid,
    type: 'X.509',
  };

  await wallet.put('appUser', identity);

  await gateway.connect(ccp, {
    wallet: wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork('ws-supplier-channel');
  const contract = network.getContract('ws-supplier-cc');

  const result = await contract.evaluateTransaction('GetAssetById', Id);
  await gateway.disconnect();
  return JSON.parse(result.toString());
};

// TODO: @Rotenda
export const assetExists = async (assetId) => {
  const gateway = new Gateway();
  try {
    await AssetTransfer.assetExists(assetId);

    // Evaluate the transaction to get the asset
    const response = await contract.evaluateTransaction('AssetExist', assetId);

    // Check if the asset exists
    if (response && response.length > 0) {
      const asset = JSON.parse(response.toString());
      return asset !== null;
    } else {
      return false;
    }
  } catch (error) {
    // Specify the type of error
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

// ? @Lucinda Done
export const ReadAsset = async (id) => {
  const gateway = new Gateway();
  const wallet = await Wallets.newInMemoryWallet();
  const identity = {
    credentials: {
      certificate: certContent,
      privateKey: privateKey,
    },
    mspId: cpp.organizations.Org1.mspid,
    type: 'X.509',
  };

  await wallet.put('appUser', identity);

  await gateway.connect(ccp, {
    wallet: wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork('ws-supplier-channel');
  const contract = network.getContract('ws-supplier-cc');
  const result = await contract.evaluateTransaction('ReadAsset', id);
  await gateway.disconnect();
  return JSON.parse(result.toString());
};

//! TODO: @Lucinda
export const GetQueryResultForQueryString = async (id) => {
  const gateway = new Gateway();
  const wallet = await Wallets.newInMemoryWallet();
  const identity = {
    credentials: {
      certificate: certContent,
      privateKey: privateKey,
    },
    mspId: cpp.organizations.Org1.mspid,
    type: 'X.509',
  };

  await wallet.put('appUser', identity);

  await gateway.connect(ccp, {
    wallet: wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork('ws-supplier-channel');
  const contract = network.getContract('ws-supplier-cc');
  const result = await contract.evaluateTransaction(
    'GetQueryResultForQueryString',
    id
  );
  await gateway.disconnect();
  return JSON.parse(result.toString());
};

//! TODO: @Lucinda
export const ProcessAsset = async (asset) => {
  const gateway = new Gateway();
  const wallet = await Wallets.newInMemoryWallet();
  const identity = {
    credentials: {
      certificate: certContent,
      privateKey: privateKey,
    },
    mspId: cpp.organizations.Org1.mspid,
    type: 'X.509',
  };

  await wallet.put('appUser', identity);

  await gateway.connect(ccp, {
    wallet: wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork('ws-supplier-channel');
  const contract = network.getContract('ws-supplier-cc');

  await contract.submitTransaction('ProcessAsset', JSON.stringify(asset));
  await gateway.disconnect();
};

//! TODO: @Lucinda
export const PackageAsset = async (asset) => {
  const gateway = new Gateway();
  const wallet = await Wallets.newInMemoryWallet();
  const identity = {
    credentials: {
      certificate: certContent,
      privateKey: privateKey,
    },
    mspId: cpp.organizations.Org1.mspid,
    type: 'X.509',
  };

  await wallet.put('appUser', identity);

  await gateway.connect(ccp, {
    wallet: wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork('ws-supplier-channel');
  const contract = network.getContract('ws-supplier-cc');

  await contract.submitTransaction('PackageAsset', JSON.stringify(asset));
  await gateway.disconnect();
};

//! TODO: @Lucinda
export const ShipAsset = async (asset) => {
  const gateway = new Gateway();
  const wallet = await Wallets.newInMemoryWallet();
  const identity = {
    credentials: {
      certificate: certContent,
      privateKey: privateKey,
    },
    mspId: cpp.organizations.Org1.mspid,
    type: 'X.509',
  };

  await wallet.put('appUser', identity);

  await gateway.connect(ccp, {
    wallet: wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork('ws-supplier-channel');
  const contract = network.getContract('ws-supplier-cc');

  await contract.submitTransaction('ShipAsset', JSON.stringify(asset));
  await gateway.disconnect();
};

//! TODO: @Lucinda
export const CompleteShipment = async (asset) => {
  const gateway = new Gateway();
  const wallet = await Wallets.newInMemoryWallet();
  const identity = {
    credentials: {
      certificate: certContent,
      privateKey: privateKey,
    },
    mspId: cpp.organizations.Org1.mspid,
    type: 'X.509',
  };

  await wallet.put('appUser', identity);

  await gateway.connect(ccp, {
    wallet: wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork('ws-supplier-channel');
  const contract = network.getContract('ws-supplier-cc');

  await contract.submitTransaction('CompleteShipment', JSON.stringify(asset));
  await gateway.disconnect();
};

export const getAllResults = async () => {
  const gateway = new Gateway();
  try {
    const wallet = await Wallets.newInMemoryWallet();
    const identity = {
      credentials: {
        certificate: certContent,
        privateKey: privateKey,
      },
      mspId: cpp.organizations.Org1.mspid,
      type: 'X.509',
    };

    await wallet.put('appUser', identity);

    await gateway.connect(ccp, {
      wallet: wallet,
      identity: 'appUser',
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('ws-supplier-channel');
    const contract = network.getContract('ws-supplier-cc');

    // Evaluate the transaction to get all assets
    const result = await contract.evaluateTransaction('GetAllResults');

    // Parse the result to get an array of assets
    const assets = JSON.parse(result.toString());

    return assets;
  } catch (error) {
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
