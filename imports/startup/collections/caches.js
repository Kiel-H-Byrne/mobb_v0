import '/imports/api/orionCache.js';

export const OCache = new OrionCache('rest', 100000);
export const GCache = new OrionCache('gids', 100000);