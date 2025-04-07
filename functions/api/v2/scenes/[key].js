export async function onRequest(context) {
  const env = context.env;
  const key = context.params.key;
  const kvstore = env.kvstore || edgeonekvstore;

  const data = await kvstore.get("scenes" + key, "arrayBuffer");

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
