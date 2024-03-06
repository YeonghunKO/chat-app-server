export function extractTokens(inputString: string) {
  const accessTokenRegex = /accessToken=([^;]+)/;
  const refreshTokenIdxRegex = /refreshTokenIdx=([^;]+)/;

  const accessTokenMatch = inputString.match(accessTokenRegex);
  const refreshTokenIdxMatch = inputString.match(refreshTokenIdxRegex);

  let accessToken = null;
  let refreshTokenIdx = null;

  if (accessTokenMatch && accessTokenMatch.length > 1) {
    accessToken = accessTokenMatch[1];
  }

  if (refreshTokenIdxMatch && refreshTokenIdxMatch.length > 1) {
    refreshTokenIdx = refreshTokenIdxMatch[1];
  }

  return { accessToken, refreshTokenIdx };
}
