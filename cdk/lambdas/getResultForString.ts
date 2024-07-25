export const getResultForString = async (event: any) => {
  try {
    const { inputString } = event.pathParameters;
    console.log('Getting Result for String:', inputString);
    // const result = await getResultForString(inputString);
    const result = 'Result for ' + inputString;
    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to get result for string',
        error: error.message,
      }),
    };
  }
};
