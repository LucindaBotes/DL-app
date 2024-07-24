// import { getAssetHistory } from './hyperledger-client';

export const getAssetHistory = async (event: any) => {
  try {
    const { assetId } = event.pathParameters;
    // const history = await getAssetHistory(assetId);
    console.log('Getting Asset History:', assetId);
    const history = [
      {
        id: '1',
        name: 'Asset 1',
        value: '100',
      },
      {
        id: '2',
        name: 'Asset 2',
        value: '200',
      },
    ];
    return {
      statusCode: 200,
      body: JSON.stringify(history),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to get asset history',
        error: error.message,
      }),
    };
  }
};
