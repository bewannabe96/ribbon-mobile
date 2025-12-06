import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useReducer,
  Dispatch,
} from "react";
import { DateTime } from "luxon";

export type SearchItem = {
  uuid: string;
  subName: string;
  mainName: string;
  location: string | null;
  fee: number | null;
  category: string;
  tags: string[];
  registrationStatus: "upcoming" | "opened" | "closed" | null;
  status: "upcoming" | "ongoing" | "ended";
  registrationSession: { open: DateTime | null; close: DateTime | null };
  period: { start: DateTime; end: DateTime };
};

export type SearchFilter = {
  categories: string[];
  districts: number[];
  minFee: number | null;
  maxFee: number | null;
  tags: string[];
  status: "upcoming" | "opened" | null;
  residenceOnly: boolean;
};

export type FilterAction =
  | { type: "SET_CATEGORIES"; payload: string[] }
  | { type: "SET_DISTRICTS"; payload: number[] }
  | { type: "SET_FEE_RANGE"; payload: [number | null, number | null] }
  | { type: "SET_TAGS"; payload: string[] }
  | { type: "SET_STATUS"; payload: "upcoming" | "opened" | null }
  | { type: "SET_TARGET"; payload: string[] }
  | { type: "SET_ALL"; payload: SearchFilter }
  | { type: "RESET" };

export type SearchScreenContextValue = {
  filter: SearchFilter;
  dispatchFilter: Dispatch<FilterAction>;
  searchItems: SearchItem[];
  setSearchItems: (value: SearchItem[]) => void;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
  nextToken: string | null;
  setNextToken: (value: string | null) => void;
  isFilterLoaded: boolean;
  setIsFilterLoaded: (value: boolean) => void;
};

export const SearchScreenContext = createContext<
  SearchScreenContextValue | undefined
>(undefined);

type SearchProviderProps = {
  children: ReactNode;
};

const initialFilterState: SearchFilter = {
  categories: [],
  districts: [],
  minFee: null,
  maxFee: null,
  tags: [],
  status: null,
  residenceOnly: false,
};

function filterReducer(
  state: SearchFilter,
  action: FilterAction,
): SearchFilter {
  switch (action.type) {
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_DISTRICTS":
      return { ...state, districts: action.payload };
    case "SET_FEE_RANGE":
      return { ...state, minFee: action.payload[0], maxFee: action.payload[1] };
    case "SET_TAGS":
      return { ...state, tags: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_TARGET":
      return {
        ...state,
        residenceOnly: action.payload.includes("residence_only"),
      };
    case "SET_ALL":
      return action.payload;
    case "RESET":
      return initialFilterState;
    default:
      return state;
  }
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [filter, dispatchFilter] = useReducer(
    filterReducer,
    initialFilterState,
  );
  const [searchItems, setSearchItems] = useState<SearchItem[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterLoaded, setIsFilterLoaded] = useState(false);

  return (
    <SearchScreenContext.Provider
      value={{
        filter,
        dispatchFilter,
        searchItems,
        setSearchItems,
        isSearching,
        setIsSearching,
        nextToken,
        setNextToken,
        isFilterLoaded,
        setIsFilterLoaded,
      }}
    >
      {children}
    </SearchScreenContext.Provider>
  );
}

export function useScreenContext() {
  const context = useContext(SearchScreenContext);

  if (context === undefined) {
    throw new Error("useScreenContext must be used within SearchProvider");
  }

  return context;
}
