import { matchJaso } from "@/lib/utils/korean-jaso-search";

type District = {
  firstLevels: {
    id: number;
    name: string;
    secondLevels: { id: number; name: string }[];
  }[];
};

const DISTRICT: District = {
  firstLevels: [
    {
      id: 1,
      name: "서울특별시",
      secondLevels: [
        { id: -18, name: "강남구" },
        { id: 10, name: "강동구" },
        { id: 13, name: "강북구" },
        { id: 39, name: "강서구" },
        { id: -22, name: "관악구" },
        { id: -23, name: "광진구" },
        { id: 35, name: "구로구" },
        { id: 20, name: "금천구" },
        { id: 24, name: "노원구" },
        { id: -27, name: "도봉구" },
        { id: 37, name: "동대문구" },
        { id: -29, name: "동작구" },
        { id: 8, name: "마포구" },
        { id: 4, name: "서대문구" },
        { id: 22, name: "서초구" },
        { id: -33, name: "성동구" },
        { id: 2, name: "성북구" },
        { id: 90, name: "송파구" },
        { id: -36, name: "양천구" },
        { id: 18, name: "영등포구" },
        { id: 6, name: "용산구" },
        { id: -39, name: "은평구" },
        { id: 28, name: "종로구" },
        { id: 41, name: "중구" },
        { id: 30, name: "중랑구" },
      ],
    },
    {
      id: 44,
      name: "경기도",
      secondLevels: [
        { id: -43, name: "수원시" },
        { id: -44, name: "성남시" },
        { id: 53, name: "고양시" },
        { id: -46, name: "용인시" },
        { id: -47, name: "부천시" },
        { id: -48, name: "안산시" },
        { id: 45, name: "안양시" },
        { id: -50, name: "남양주시" },
        { id: -51, name: "화성시" },
        { id: -52, name: "평택시" },
        { id: -53, name: "의정부시" },
        { id: -54, name: "시흥시" },
        { id: 80, name: "파주시" },
        { id: -56, name: "김포시" },
        { id: -57, name: "광명시" },
        { id: -58, name: "광주시" },
        { id: -59, name: "군포시" },
        { id: -60, name: "오산시" },
        { id: -61, name: "이천시" },
        { id: -62, name: "양주시" },
        { id: -63, name: "안성시" },
        { id: -64, name: "구리시" },
        { id: -65, name: "포천시" },
        { id: -66, name: "의왕시" },
        { id: -67, name: "하남시" },
        { id: -68, name: "여주시" },
        { id: -69, name: "양평군" },
        { id: -70, name: "동두천시" },
        { id: -71, name: "과천시" },
        { id: -72, name: "가평군" },
        { id: -73, name: "연천군" },
      ],
    },
    {
      id: 60,
      name: "인천광역시",
      secondLevels: [
        { id: 61, name: "중구" },
        { id: -75, name: "동구" },
        { id: -76, name: "미추홀구" },
        { id: -77, name: "연수구" },
        { id: -78, name: "남동구" },
        { id: -79, name: "부평구" },
        { id: -80, name: "계양구" },
        { id: -81, name: "서구" },
        { id: -82, name: "강화군" },
        { id: -83, name: "옹진군" },
      ],
    },
    {
      id: 50,
      name: "부산광역시",
      secondLevels: [
        { id: -84, name: "중구" },
        { id: -85, name: "서구" },
        { id: -86, name: "동구" },
        { id: -87, name: "영도구" },
        { id: -88, name: "부산진구" },
        { id: -89, name: "동래구" },
        { id: -90, name: "남구" },
        { id: -91, name: "북구" },
        { id: 51, name: "해운대구" },
        { id: -93, name: "사하구" },
        { id: -94, name: "금정구" },
        { id: -95, name: "강서구" },
        { id: -96, name: "연제구" },
        { id: -97, name: "수영구" },
        { id: -98, name: "사상구" },
        { id: -99, name: "기장군" },
      ],
    },
    {
      id: -5,
      name: "대구광역시",
      secondLevels: [
        { id: -100, name: "중구" },
        { id: -101, name: "동구" },
        { id: -102, name: "서구" },
        { id: -103, name: "남구" },
        { id: -104, name: "북구" },
        { id: -105, name: "수성구" },
        { id: -106, name: "달서구" },
        { id: -107, name: "달성군" },
      ],
    },
    {
      id: 65,
      name: "대전광역시",
      secondLevels: [
        { id: -108, name: "동구" },
        { id: -109, name: "중구" },
        { id: -110, name: "서구" },
        { id: 66, name: "유성구" },
        { id: -112, name: "대덕구" },
      ],
    },
    {
      id: -7,
      name: "광주광역시",
      secondLevels: [
        { id: -113, name: "동구" },
        { id: -114, name: "서구" },
        { id: -115, name: "남구" },
        { id: -116, name: "북구" },
        { id: -117, name: "광산구" },
      ],
    },
    {
      id: 77,
      name: "울산광역시",
      secondLevels: [
        { id: -118, name: "중구" },
        { id: -119, name: "남구" },
        { id: -120, name: "동구" },
        { id: -121, name: "북구" },
        { id: 78, name: "울주군" },
      ],
    },
    {
      id: -9,
      name: "세종특별자치시",
      secondLevels: [{ id: -123, name: "세종시" }],
    },
    {
      id: 71,
      name: "강원특별자치도",
      secondLevels: [
        { id: -124, name: "춘천시" },
        { id: -125, name: "원주시" },
        { id: 72, name: "강릉시" },
        { id: -127, name: "동해시" },
        { id: -128, name: "태백시" },
        { id: -129, name: "속초시" },
        { id: -130, name: "삼척시" },
      ],
    },
    {
      id: -11,
      name: "충청북도",
      secondLevels: [
        { id: -131, name: "청주시" },
        { id: -132, name: "충주시" },
        { id: -133, name: "제천시" },
      ],
    },
    {
      id: 86,
      name: "충청남도",
      secondLevels: [
        { id: -134, name: "천안시" },
        { id: 87, name: "공주시" },
        { id: -136, name: "보령시" },
        { id: -137, name: "아산시" },
        { id: -138, name: "서산시" },
        { id: -139, name: "논산시" },
        { id: -140, name: "계룡시" },
        { id: -141, name: "당진시" },
      ],
    },
    {
      id: 82,
      name: "전북특별자치도",
      secondLevels: [
        { id: 83, name: "전주시" },
        { id: -143, name: "군산시" },
        { id: -144, name: "익산시" },
        { id: -145, name: "정읍시" },
        { id: -146, name: "남원시" },
        { id: -147, name: "김제시" },
      ],
    },
    {
      id: -14,
      name: "전라남도",
      secondLevels: [
        { id: -148, name: "목포시" },
        { id: -149, name: "여수시" },
        { id: -150, name: "순천시" },
        { id: -151, name: "나주시" },
        { id: -152, name: "광양시" },
      ],
    },
    {
      id: 56,
      name: "경상북도",
      secondLevels: [
        { id: -153, name: "포항시" },
        { id: 57, name: "경주시" },
        { id: -155, name: "김천시" },
        { id: -156, name: "안동시" },
        { id: -157, name: "구미시" },
        { id: 93, name: "영주시" },
        { id: -159, name: "영천시" },
        { id: -160, name: "상주시" },
        { id: -161, name: "문경시" },
        { id: -162, name: "경산시" },
      ],
    },
    {
      id: -16,
      name: "경상남도",
      secondLevels: [
        { id: -163, name: "창원시" },
        { id: -164, name: "진주시" },
        { id: -165, name: "통영시" },
        { id: -166, name: "사천시" },
        { id: -167, name: "김해시" },
        { id: -168, name: "밀양시" },
        { id: -169, name: "거제시" },
        { id: -170, name: "양산시" },
      ],
    },
    {
      id: 74,
      name: "제주특별자치도",
      secondLevels: [
        { id: -171, name: "제주시" },
        { id: 75, name: "서귀포시" },
      ],
    },
  ],
};

export function getLevelOneDistricts(): { id: number; name: string }[] {
  return DISTRICT.firstLevels.map((value) => ({
    id: value.id,
    name: value.name,
  }));
}

export function getLevelTwoDistricts(
  levelOneDistrictId: number,
): { id: number; name: string }[] {
  for (const firstLevel of DISTRICT.firstLevels) {
    if (firstLevel.id === levelOneDistrictId) {
      return firstLevel.secondLevels.map((value) => ({
        id: value.id,
        name: value.name,
      }));
    }
  }
  return [];
}

export function getLevelTwoDistrictsByIds(
  ids: number[],
): { id: number; name: string }[] {
  const searchResult: Record<number, { id: number; name: string }> = {};

  for (const firstLevel of DISTRICT.firstLevels) {
    for (const secondLevel of firstLevel.secondLevels) {
      if (ids.includes(secondLevel.id)) {
        searchResult[secondLevel.id] = secondLevel;
      }
    }
  }

  return ids.map((id) => searchResult[id]);
}

export function searchDistricts(
  query: string,
): { id: number; name: string; parentName: string }[] {
  const result: { id: number; name: string; parentName: string }[] = [];

  for (const firstLevel of DISTRICT.firstLevels) {
    for (const secondLevel of firstLevel.secondLevels) {
      if (matchJaso(query, secondLevel.name)) {
        result.push({
          id: secondLevel.id,
          name: secondLevel.name,
          parentName: firstLevel.name,
        });
      }
    }
  }

  return result;
}
