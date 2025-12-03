/**
 * Korean Jaso (자소) Search Utility
 *
 * Provides fuzzy search functionality for Korean text by decomposing
 * characters into individual jaso (consonants and vowels).
 */

// Korean Unicode ranges
const HANGUL_START = 0xac00; // '가'
const HANGUL_END = 0xd7a3; // '힣'

// Jaso components
const CHOSUNG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

const JUNGSUNG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];

const JONGSUNG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

/**
 * Decomposes a Korean character into its jaso components (초성, 중성, 종성)
 */
function decomposeChar(char: string): string {
  const code = char.charCodeAt(0);

  // Check if character is in Hangul syllable range
  if (code < HANGUL_START || code > HANGUL_END) {
    return char;
  }

  const syllableIndex = code - HANGUL_START;
  const chosungIndex = Math.floor(syllableIndex / 588);
  const jungsungIndex = Math.floor((syllableIndex % 588) / 28);
  const jongsungIndex = syllableIndex % 28;

  return CHOSUNG[chosungIndex] + JUNGSUNG[jungsungIndex] + JONGSUNG[jongsungIndex];
}

/**
 * Decomposes a Korean string into jaso components, ignoring whitespace
 *
 * @example
 * decomposeString('강남구') // Returns 'ㄱㅏㅇㄴㅏㅁㄱㅜ'
 * decomposeString('강나') // Returns 'ㄱㅏㅇㄴㅏ'
 * decomposeString('강남 1구') // Returns 'ㄱㅏㅇㄴㅏㅁ1ㄱㅜ'
 */
export function decomposeString(str: string): string {
  return str.replace(/\s/g, '').split('').map(decomposeChar).join('');
}

/**
 * Checks if a target string matches the query when both are decomposed to jaso
 * Whitespace is ignored in both query and target
 *
 * @param query - The search query
 * @param target - The string to search in
 * @returns true if the decomposed query is found in the decomposed target
 *
 * @example
 * matchJaso('강나', '강남구') // Returns true
 * matchJaso('서대', '서대문구') // Returns true
 * matchJaso('강남1구', '강남 1구') // Returns true
 * matchJaso('ㄱㄴ', '강남구') // Returns false (needs exact jaso match)
 */
export function matchJaso(query: string, target: string): boolean {
  const decomposedQuery = decomposeString(query);
  const decomposedTarget = decomposeString(target);

  return decomposedTarget.includes(decomposedQuery);
}

/**
 * Filters an array of strings based on jaso search
 *
 * @param query - The search query
 * @param items - Array of strings to search through
 * @returns Filtered array containing only matching items
 *
 * @example
 * const districts = ['강남구', '강북구', '강동구', '서대문구'];
 * filterByJaso('강나', districts) // Returns ['강남구']
 * filterByJaso('강', districts) // Returns ['강남구', '강북구', '강동구']
 */
export function filterByJaso(query: string, items: string[]): string[] {
  if (!query.trim()) {
    return items;
  }

  return items.filter(item => matchJaso(query, item));
}

/**
 * Filters an array of objects based on jaso search of a specific property
 *
 * @param query - The search query
 * @param items - Array of objects to search through
 * @param getSearchText - Function to extract searchable text from each item
 * @returns Filtered array containing only matching items
 *
 * @example
 * const events = [
 *   { name: '강남 축제', location: '강남구' },
 *   { name: '강북 음악회', location: '강북구' }
 * ];
 * filterObjectsByJaso('강나', events, e => e.location) // Returns first event only
 * filterObjectsByJaso('축제', events, e => e.name) // Returns first event only
 */
export function filterObjectsByJaso<T>(
  query: string,
  items: T[],
  getSearchText: (item: T) => string
): T[] {
  if (!query.trim()) {
    return items;
  }

  return items.filter(item => matchJaso(query, getSearchText(item)));
}
