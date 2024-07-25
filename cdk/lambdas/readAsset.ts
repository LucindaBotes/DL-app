// import { getAssetById } from './hyperledger-client';

export const readAsset = async (event: any) => {
  try {
    const { itemID } = event.pathParameters;
    console.log('Reading Asset:', itemID);
    // const mockAsset = await getAssetById(itemID);
    const asset = {
      itemID,
      name: 'Asset Name',
      description: 'Asset Description',
      owner: 'Asset Owner',
    };
    return {
      statusCode: 200,
      body: JSON.stringify(asset),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to read asset',
        error: error.message,
      }),
    };
  }
};
