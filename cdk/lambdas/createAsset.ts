// import { createAsset } from './hyperledger-client';

export const createAsset = async (event: any) => {
  try {
    const asset = JSON.parse(event.body);
    console.log('Creating Asset:', asset);
    // await createAsset(asset);
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Asset created successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to create asset',
        error: error.message,
      }),
    };
  }
};
