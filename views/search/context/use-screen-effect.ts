import { useScreenContext } from "@/views/search/context/search-screen-context";
import { useEffect } from "react";
import { useOperation } from "@/views/search/context/use-operation";

export function useScreenEffect() {
  const { filter } = useScreenContext();
  const { search } = useOperation();

  useEffect(() => {
    search().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);
}
