// Respond to OPTIONS method
export async function onRequestOptions(context){
  const cors_origin = context.env.CORS_ALLOW_ORIGIN || "*";
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": cors_origin,
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Max-Age": "86400",
    },
  });
};

// Set CORS to all /api responses
export async function onRequest(context){
  const response = await context.next();
  const cors_origin = context.env.CORS_ALLOW_ORIGIN || "*";
  response.headers.set("Access-Control-Allow-Origin", cors_origin);
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
};
