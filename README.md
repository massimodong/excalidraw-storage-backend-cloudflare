# excalidraw-storage-backend-cloudflare

Use [Cloudflare Workers KV](https://developers.cloudflare.com/kv/) for Excalidraw storage, replacing [excalidraw-storage-backend](https://github.com/alswl/excalidraw-storage-backend).

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

## Deploy to Tencent's Edgeone Pages
This server can also be deployed to [Tencent's Edgeone Pages](https://edgeone.ai/document/160427672992178176).
This will use their KV store system.
* Fork this project to your own repository.
* Create your own edgeone pages project, by connecting it to your github repository.
* Create a KV namespace.
* In the project dashboard, bind the KV namespave, with variable name `edgeonekvstore`.
* Redeploy.

## CORS
By default, this store server will set the header
`Access-Control-Allow-Origin: *`.
This allows any client to connect to this store server.
To modify this behaviour, and to allow only specific domains to access this store server, create an environment variable named `CORS_ALLOW_ORIGIN` with the value `https://your-domain-name.com`.
This will set the header
`Access-Control-Allow-Origin: https://your-domain-name.com`.
This can be done in Cloudflare Page Dashboard or Edgeone Page Dashboard.
