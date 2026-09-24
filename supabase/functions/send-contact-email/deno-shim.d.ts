/** Local types so the Vite TypeScript language service can check this Deno function. */
declare namespace Deno {
  const env: {
    get(key: string): string | undefined;
  };
  function serve(
    handler: (request: Request) => Response | Promise<Response>
  ): void;
}
