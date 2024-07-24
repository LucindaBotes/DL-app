// import { getAssetsByOwner } from './hyperledger-client';

export const getAssetsByOwner = async (event: any) => {
  try {
    const { ownerId } = JSON.parse(event.body);
    // const assets = await getAssetsByOwner(ownerId);
    const assets = [
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
      body: JSON.stringify(assets),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to get assets by owner',
        error: error.message,
      }),
    };
  }
};
