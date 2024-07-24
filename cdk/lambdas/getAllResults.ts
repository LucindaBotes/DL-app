// import { getAllResults } from './hyperledger-client';

export const getAllResults = async (event: any) => {
  try {
    // const assets = await getAllResults();
    const assets = [
      {
        assetId: 'asset1',
        name: 'Asset 1',
        description: 'Description of Asset 1',
      },
      {
        assetId: 'asset2',
        name: 'Asset 2',
        description: 'Description of Asset 2',
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
        message: 'Failed to get results',
        error: error.message,
      }),
    };
  }
};
