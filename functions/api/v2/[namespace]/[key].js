import { nanoid } from 'nanoid';

export async function onRequestGet(context) {
  const env = context.env;
  const key = context.params.key;
  const namespace = context.params.namespace;

  const data = await env.kvstore.get(namespace + key, "arrayBuffer");

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

export async function onRequestPut(context) {
  const SIZE_LIMIT = 26214400; // 25MiB value size upper bound for cloudflare's kv store
  const request = context.request;
  const blob = await request.blob();
  const env = context.env;
  const key = context.params.key;
  const namespace = context.params.namespace;

  const kv_data = await blob.arrayBuffer();

  if(blob.size > SIZE_LIMIT){
    const message = JSON.stringify({
      message: "Could not upload the data.",
    }, null, 2);

    return new Response(message, {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      status: 500,
    });
  }

  // store the data and return
  try {
    await env.kvstore.put(namespace + key, kv_data); //TODO: expire time ?

    const url = URL.parse(request.url);

    const ret = JSON.stringify({
      id: key,
    }, null, 2);

    return new Response(ret, {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
    });
  } catch (e) {
    return new Response(e.message, {status: 500});
  }
}
