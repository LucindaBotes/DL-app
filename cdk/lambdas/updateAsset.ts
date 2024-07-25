// import { updateAsset } from './hyperledger-client';

export const updateAsset = async (event: any) => {
  try {
    const { itemID } = event.pathParameters;
    const asset = JSON.parse(event.body);
    console.log('Updating Asset:', itemID, asset);
    // await updateAsset(itemID); //asset
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Asset updated successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to update asset',
        error: error.message,
      }),
    };
  }
};
