import { nanoid } from 'nanoid';

export async function onRequestPost(context) {
  const SIZE_LIMIT = 26214400; // 25MiB value size upper bound for cloudflare's kv store
  const request = context.request;
  const blob = await request.blob();
  const env = context.env;
  const kvstore = env.kvstore || edgeonekvstore;

  const kv_key = nanoid();
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
    await kvstore.put("scenes" + kv_key, kv_data); //TODO: expire time ?

    const ret = JSON.stringify({
      id: kv_key,
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
