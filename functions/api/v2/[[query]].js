import { nanoid } from 'nanoid';

export async function onRequest(context) {
  const SIZE_LIMIT = 26214400; // 25MiB value size upper bound for cloudflare's kv store

  const query = context.params.query;
  const request = context.request;
  const env = context.env;

  const kvstore = env.kvstore || edgeonekvstore;

  let res = null;

  const namespace = request.method === "POST" ? "scenes" : query[0];
  const keyname = request.method === "POST" ? nanoid() : query[1];
  const kv_key = namespace + keyname;

  switch(request.method){
    case "GET":
      const data = await kvstore.get(kv_key, "arrayBuffer");
      if(data !== null){
        res = new Response(data, {
          headers: {
            'content-type': 'application/octet-stream',
          },
        });
      }else{
        const message = JSON.stringify({
          message: "Could not find the file.",
        }, null, 2);

        res = new Response(message, {
          headers: {
            'content-type': 'application/json; charset=UTF-8',
          },
          status: 404,
        });
      }
      break;

    case "POST":
    case "PUT":
      const blob = await request.blob();
      if(blob.size > SIZE_LIMIT){
        const message = JSON.stringify({
          message: "Could not upload the data.",
        }, null, 2);

        res = new Response(message, {
          headers: {
            'content-type': 'application/json; charset=UTF-8',
          },
          status: 500,
        });
        break;
      }

      // store the data and return
      try {
        const kv_data = await blob.arrayBuffer();
        await kvstore.put(kv_key, kv_data); //TODO: expire time ?

        const ret = JSON.stringify({
          id: keyname,
        }, null, 2);

        res = new Response(ret, {
          headers: {
            'content-type': 'application/json; charset=UTF-8',
          },
        });
      } catch (e) {
        res = new Response(e.message, {status: 500});
      }
      break;
    case "OPTIONS":
      res = new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        },
      });

      break;
  }

  const cors_origin = context.env.CORS_ALLOW_ORIGIN || "*";
  res.headers.append("Access-Control-Allow-Origin", cors_origin);
  res.headers.append("Access-Control-Max-Age", "86400");

  return res;
}
