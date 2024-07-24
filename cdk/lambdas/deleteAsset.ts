// import { deleteAsset } from './hyperledger-client';

export const deleteAsset = async (event: any) => {
  try {
    const { assetId } = event.pathParameters;
    console.log('Deleting Asset:', assetId);
    // await deleteAsset(assetId);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Asset deleted successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to delete asset',
        error: error.message,
      }),
    };
  }
};
