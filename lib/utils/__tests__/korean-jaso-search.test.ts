import { describe, it, expect } from '@jest/globals';
import {
  decomposeString,
  matchJaso,
  filterByJaso,
  filterObjectsByJaso,
} from '../korean-jaso-search';

describe('decomposeString', () => {
  it('should decompose Korean characters into jaso', () => {
    expect(decomposeString('강남구')).toBe('ㄱㅏㅇㄴㅏㅁㄱㅜ');
    expect(decomposeString('강나')).toBe('ㄱㅏㅇㄴㅏ');
    expect(decomposeString('서울')).toBe('ㅅㅓㅇㅜㄹ');
  });

  it('should handle mixed Korean and non-Korean characters', () => {
    expect(decomposeString('강남1구')).toBe('ㄱㅏㅇㄴㅏㅁ1ㄱㅜ');
    expect(decomposeString('서울 Seoul')).toBe('ㅅㅓㅇㅜㄹSeoul');
  });

  it('should ignore whitespace', () => {
    expect(decomposeString('강남 1구')).toBe('ㄱㅏㅇㄴㅏㅁ1ㄱㅜ');
    expect(decomposeString('강 남 구')).toBe('ㄱㅏㅇㄴㅏㅁㄱㅜ');
    expect(decomposeString('  강남구  ')).toBe('ㄱㅏㅇㄴㅏㅁㄱㅜ');
  });

  it('should handle empty string', () => {
    expect(decomposeString('')).toBe('');
  });

  it('should preserve non-Korean characters', () => {
    expect(decomposeString('ABC123')).toBe('ABC123');
  });
});

describe('matchJaso', () => {
  it('should match partial Korean text', () => {
    expect(matchJaso('강나', '강남구')).toBe(true);
    expect(matchJaso('서대', '서대문구')).toBe(true);
    expect(matchJaso('강', '강남구')).toBe(true);
  });

  it('should not match non-matching text', () => {
    expect(matchJaso('강북', '강남구')).toBe(false);
    expect(matchJaso('서초', '강남구')).toBe(false);
  });

  it('should handle exact matches', () => {
    expect(matchJaso('강남구', '강남구')).toBe(true);
    expect(matchJaso('서울', '서울특별시')).toBe(true);
  });

  it('should handle empty query', () => {
    expect(matchJaso('', '강남구')).toBe(true);
    expect(matchJaso('', '')).toBe(true);
  });

  it('should be case-sensitive for non-Korean text', () => {
    expect(matchJaso('ABC', 'ABCDEF')).toBe(true);
    expect(matchJaso('abc', 'ABCDEF')).toBe(false);
  });

  it('should ignore whitespace in query and target', () => {
    expect(matchJaso('강남1구', '강남 1구')).toBe(true);
    expect(matchJaso('강 남 1 구', '강남1구')).toBe(true);
    expect(matchJaso('강남 1', '강남 1구')).toBe(true);
    expect(matchJaso('  강남  ', '강남구')).toBe(true);
  });
});

describe('filterByJaso', () => {
  const districts = [
    '강남구',
    '강북구',
    '강동구',
    '서대문구',
    '서초구',
    '송파구',
    '강남 1구',
  ];

  it('should filter items matching the query', () => {
    expect(filterByJaso('강나', districts)).toEqual(['강남구', '강남 1구']);
    expect(filterByJaso('강', districts)).toEqual(['강남구', '강북구', '강동구', '강남 1구']);
    expect(filterByJaso('서', districts)).toEqual(['서대문구', '서초구']);
  });

  it('should ignore whitespace when filtering', () => {
    expect(filterByJaso('강남1구', districts)).toEqual(['강남 1구']);
    expect(filterByJaso('강남 1', districts)).toEqual(['강남 1구']);
  });

  it('should return all items for empty query', () => {
    expect(filterByJaso('', districts)).toEqual(districts);
    expect(filterByJaso('   ', districts)).toEqual(districts);
  });

  it('should return empty array if no matches', () => {
    expect(filterByJaso('제주', districts)).toEqual([]);
    expect(filterByJaso('xyz', districts)).toEqual([]);
  });

  it('should handle exact matches', () => {
    expect(filterByJaso('강남구', districts)).toEqual(['강남구']);
  });
});

describe('filterObjectsByJaso', () => {
  const events = [
    { id: 1, name: '강남 축제', location: '강남구' },
    { id: 2, name: '강북 음악회', location: '강북구' },
    { id: 3, name: '서울 마라톤', location: '서대문구' },
    { id: 4, name: '송파 불꽃축제', location: '송파구' },
  ];

  it('should filter objects by name property', () => {
    const result = filterObjectsByJaso('축제', events, e => e.name);
    expect(result).toEqual([
      { id: 1, name: '강남 축제', location: '강남구' },
      { id: 4, name: '송파 불꽃축제', location: '송파구' },
    ]);
  });

  it('should filter objects by location property', () => {
    const result = filterObjectsByJaso('강나', events, e => e.location);
    expect(result).toEqual([
      { id: 1, name: '강남 축제', location: '강남구' },
    ]);
  });

  it('should filter objects by custom getter', () => {
    const result = filterObjectsByJaso(
      '강남',
      events,
      e => `${e.name} ${e.location}`
    );
    expect(result).toEqual([
      { id: 1, name: '강남 축제', location: '강남구' },
    ]);
  });

  it('should return all items for empty query', () => {
    const result = filterObjectsByJaso('', events, e => e.name);
    expect(result).toEqual(events);
  });

  it('should return empty array if no matches', () => {
    const result = filterObjectsByJaso('제주', events, e => e.location);
    expect(result).toEqual([]);
  });

  it('should handle empty array', () => {
    type Event = { id: number; name: string; location: string };
    const result = filterObjectsByJaso<Event>('강남', [], e => e.name);
    expect(result).toEqual([]);
  });
});
