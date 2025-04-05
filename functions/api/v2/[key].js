export async function onRequest(context) {
  const env = context.env;
  const key = context.params.key;

  const data = await env.kvstore.get(key, "arrayBuffer");

  if(data !== null){
    return new Response(data, {
      headers: {
        'content-type': 'application/octet-stream',
      },
    });
  }else{
    const message = JSON.stringify({
      message: "Could not find the file.",
    }, null, 2);

    return new Response(message, {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      status: 404,
    });
  }
}
