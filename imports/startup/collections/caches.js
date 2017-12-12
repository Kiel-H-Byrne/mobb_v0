import '/imports/api/orionCache.js';

export const OCache = new OrionCache('rest', 86400); // 1day
export const GCache = new OrionCache('gids', 172800); // 2days
export const LongCache = new OrionCache('long', 345600); // 4days
export const ShortCache = new OrionCache('short', 3600); // 1hr