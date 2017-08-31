import '/imports/api/orionCache.js';

export const OCache = new OrionCache('rest', 3600);
export const GCache = new OrionCache('gids', 3600);