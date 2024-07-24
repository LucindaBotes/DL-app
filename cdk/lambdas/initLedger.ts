export const initLedger = async (event: any) => {
  try {
    console.log('Initializing Ledger');
    // await initLedger();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Ledger initialized successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to initialize ledger',
        error: error.message,
      }),
    };
  }
};
