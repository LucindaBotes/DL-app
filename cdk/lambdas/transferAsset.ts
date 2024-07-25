// import { transferAsset } from './hyperledger-client';

export const transferAsset = async (event: any) => {
  try {
    const { assetId } = event.pathParameters;
    const { newOwner } = JSON.parse(event.body);
    const { transferTransaction } = JSON.parse(event.body);

    console.log('Transferring Asset:', assetId, newOwner, transferTransaction);
    // await transferAsset(assetId, newOwner);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Asset transferred successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to transfer asset',
        error: error.message,
      }),
    };
  }
};
