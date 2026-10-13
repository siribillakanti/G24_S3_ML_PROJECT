const SEARCHES_KEY = 'customer_rec_recent_searches';

export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(SEARCHES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read recent searches from localStorage:', err);
    return [];
  }
}

export function addRecentSearch(searchData) {
  try {
    const existing = getRecentSearches();
    const newEntry = {
      id: Date.now().toString(),
      categories: searchData.categories || [],
      keyword: searchData.keyword || '',
      maxPrice: searchData.maxPrice !== undefined ? searchData.maxPrice : null,
      resultCount: searchData.n || 10,
      formattedTime: new Date().toLocaleString(),
      timestamp: Date.now(),
    };

    // Filter out duplicates with the exact same filters
    const filtered = existing.filter(
      (s) =>
        s.keyword !== newEntry.keyword ||
        s.maxPrice !== newEntry.maxPrice ||
        JSON.stringify(s.categories) !== JSON.stringify(newEntry.categories)
    );

    const updated = [newEntry, ...filtered].slice(0, 15);
    localStorage.setItem(SEARCHES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Could not save search to localStorage:', err);
    return [];
  }
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(SEARCHES_KEY);
  } catch (err) {
    console.warn('Could not clear searches:', err);
  }
}
