// import { assetExists } from './hyperledger-client';

export const assetExists = async (event: any) => {
  try {
    const { assetId } = event.pathParameters;
    // const exists = await assetExists(assetId);
    const exists = true;
    return {
      statusCode: 200,
      body: JSON.stringify({ exists }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to check asset existence',
        error: error.message,
      }),
    };
  }
};
