// import { getAllAssets } from './hyperledger-client';

export const getAllAssets = async (event: any) => {
  try {
    // const assets = await getAllAssets();
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
    console.log('Getting all Assets:', assets);
    return {
      statusCode: 200,
      body: JSON.stringify(assets),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to get assets',
        error: error.message,
      }),
    };
  }
};
