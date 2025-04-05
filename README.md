# excalidraw-store-cloudflare

Use [Cloudflare Workers KV](https://developers.cloudflare.com/kv/) for Excalidraw storage, replacing [excalidraw-store](https://github.com/excalidraw/excalidraw-store).

## Local Development

First, run `npm install` to install the dependencies.
Then, to start the store server locally, run
```
npx wrangler pages dev
```

## Deploy to Cloudflare Pages
Following this link [https://developers.cloudflare.com/kv/get-started/](https://developers.cloudflare.com/kv/get-started/):
* Fork this project to your own repository.
* Create your own cloudflare pages project, by connecting it to your github repository. (Do not create a Worker project!)
* Change the page project's build command to be `npm install`.
* Create a KV namespace.
* In your forked repository, update the file `wrangler.jsonc`. Change the `<BINDING_ID>` to your newly created KV namespace.
* Push the changes to your repository.

## CORS
By default, this store server will set the header
`Access-Control-Allow-Origin: *`.
This allows any client to connect to this store server.
To modify this behaviour, and to allow only specific domains to access this store server, create an environment variable named `CORS_ALLOW_ORIGIN` with the value `https://your-domain-name.com`.
This will set the header
`Access-Control-Allow-Origin: https://your-domain-name.com`.
This can be done in Cloudflare Page Dashboard.
