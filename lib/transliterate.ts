
export async function transliterateText(textNodes: string[], langCode: string = "hi-t-i0-und"): Promise<Record<string, string>> {
  if (!textNodes.length) return {};

  const result: Record<string, string> = {};
  
  // Google Input Tools API works best with single phrases/words.
  // Batching via delimiters is flaky.
  // We will run requests in parallel with a concurrency limit.
  const CONCURRENCY_LIMIT = 5;
  
  // Helper to process a single chunk
  const processWord = async (word: string) => {
      try {
          const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=${langCode}&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`;
          const response = await fetch(url);
          const data = await response.json();
          if (data[0] === "SUCCESS" && data[1] && data[1][0] && data[1][0][1]) {
             result[word] = data[1][0][1][0];
          } else {
             result[word] = word;
          }
      } catch (err) {
          result[word] = word;
      }
  };

  // Process all words in chunks
  for (let i = 0; i < textNodes.length; i += CONCURRENCY_LIMIT) {
      const chunk = textNodes.slice(i, i + CONCURRENCY_LIMIT);
      await Promise.all(chunk.map(word => processWord(word)));
  }

  return result;
}
