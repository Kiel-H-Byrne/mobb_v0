import '/imports/api/orionCache.js';

export const OCache = new OrionCache('rest', 36000);
export const GCache = new OrionCache('gids', 36000);
export const LongCache = new OrionCache('long', 360000); //100 hrs = 4 days
export const ShortCache = new OrionCache('short', 3600);