export async function fetchStream(opts: {
  url: string;
  token: string;
  onChunk: (chunk: string) => Promise<unknown>;
  options?: Parameters<typeof fetch>[1];
}) {
  const { url, onChunk, options } = opts;

  const response = await fetch(url, options);

  if (response.body === null) {
    throw new Error("ReadableStream not yet supported in this browser.");
  }

  for await (const chunk of response.body as any) {
    if (options?.signal?.aborted) break; // just break out of loop

    onChunk(chunk.toString());
  }
}
