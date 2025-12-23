/**
 * Question Cache Utility
 * Manages localStorage caching for questions with expiration
 */

const CACHE_PREFIX = 'kbc_question_';
const CACHE_EXPIRY_HOURS = 24; // Questions expire after 24 hours
const QUOTA_KEY = 'kbc_api_quota';

/**
 * Get cached question for a level
 * @param {number} level - Question level (1-15)
 * @returns {Object|null} Cached question or null if not found/expired
 */
export function getCachedQuestion(level) {
  try {
    const cacheKey = `${CACHE_PREFIX}${level}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is expired
    if (data.expiresAt && now > data.expiresAt) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return data.question;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

/**
 * Save question to cache
 * @param {number} level - Question level (1-15)
 * @param {Object} question - Question object to cache
 */
export function saveQuestionToCache(level, question) {
  try {
    const cacheKey = `${CACHE_PREFIX}${level}`;
    const expiresAt = Date.now() + (CACHE_EXPIRY_HOURS * 60 * 60 * 1000);
    
    const data = {
      question,
      cachedAt: Date.now(),
      expiresAt,
      level
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(data));
    console.log(`💾 Cached question for level ${level}`);
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

/**
 * Clear all cached questions
 */
export function clearQuestionCache() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('🗑️ Cleared question cache');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
export function getCacheStats() {
  try {
    const keys = Object.keys(localStorage);
    const questionKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    const stats = {
      totalCached: questionKeys.length,
      levels: []
    };
    
    questionKeys.forEach(key => {
      const data = JSON.parse(localStorage.getItem(key));
      stats.levels.push({
        level: data.level,
        cachedAt: new Date(data.cachedAt).toLocaleString(),
        expiresAt: new Date(data.expiresAt).toLocaleString(),
        isExpired: Date.now() > data.expiresAt
      });
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { totalCached: 0, levels: [] };
  }
}

/**
 * Check if quota is exhausted
 * @returns {boolean}
 */
export function isQuotaExhausted() {
  try {
    const quotaData = localStorage.getItem(QUOTA_KEY);
    if (!quotaData) return false;
    
    const data = JSON.parse(quotaData);
    const now = Date.now();
    
    // Reset quota status after 24 hours
    if (data.resetAt && now > data.resetAt) {
      localStorage.removeItem(QUOTA_KEY);
      return false;
    }
    
    return data.exhausted === true;
  } catch (error) {
    return false;
  }
}

/**
 * Mark quota as exhausted
 * @param {number} retryAfterSeconds - Seconds to wait before retry
 */
export function markQuotaExhausted(retryAfterSeconds = 86400) {
  try {
    const resetAt = Date.now() + (retryAfterSeconds * 1000);
    const data = {
      exhausted: true,
      markedAt: Date.now(),
      resetAt
    };
    localStorage.setItem(QUOTA_KEY, JSON.stringify(data));
    console.log('⚠️ Quota marked as exhausted');
  } catch (error) {
    console.error('Error marking quota:', error);
  }
}

/**
 * Clear quota status (when quota resets)
 */
export function clearQuotaStatus() {
  localStorage.removeItem(QUOTA_KEY);
}

