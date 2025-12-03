import { ScrollView, StyleSheet } from "react-native";
import React, { useCallback, useMemo } from "react";
import { Color, Sizing, SizingScale } from "@/constants/theme";
import { OptionItem } from "@/components/selection-modal-flow";
import { useSearchFilters } from "@/views/search/context/use-search-filters";
import { SearchFilter } from "@/views/search/context/search-screen-context";
import Pill from "@/components/ui/pill";

const CATEGORY_OPTIONS: OptionItem[] = [
  { label: "강의/강좌", value: "lecture" },
  { label: "전시", value: "exhibition" },
  { label: "문화체험", value: "experience" },
  { label: "공연", value: "performance" },
  { label: "행사/축제", value: "festival" },
];

function getCategoryOptionItemsFromFilter(filter: SearchFilter): OptionItem[] {
  return CATEGORY_OPTIONS.filter((opt) =>
    filter.categories.includes(opt.value),
  );
}

export default function TopSearchFilters() {
  const { filter, dispatchFilter } = useSearchFilters();

  const selectedCategories = useMemo(
    () => getCategoryOptionItemsFromFilter(filter),
    [filter],
  );

  const selectedCategoryValueSet = useMemo(
    () => new Set(selectedCategories.map((v) => v.value)),
    [selectedCategories],
  );

  const onAllPress = useCallback(() => {
    dispatchFilter({ type: "SET_CATEGORIES", payload: [] });
  }, [dispatchFilter]);

  const onCategoryPress = useCallback(
    (value: string) => {
      if (selectedCategoryValueSet.has(value)) {
        selectedCategoryValueSet.delete(value);
      } else {
        selectedCategoryValueSet.add(value);
      }

      dispatchFilter({
        type: "SET_CATEGORIES",
        payload: Array.from(selectedCategoryValueSet),
      });
    },
    [dispatchFilter, selectedCategoryValueSet],
  );

  return (
    <ScrollView
      horizontal
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsHorizontalScrollIndicator={false}
    >
      <Pill
        name="전체"
        variant={selectedCategories.length === 0 ? "primary" : "default"}
        onPress={onAllPress}
      />
      {CATEGORY_OPTIONS.map((optionItem) => (
        <Pill
          key={optionItem.value}
          name={optionItem.label}
          variant={
            selectedCategoryValueSet.has(optionItem.value)
              ? "primary"
              : "default"
          }
          onPress={onCategoryPress.bind(null, optionItem.value)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    borderBottomWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.background,
  },

  scrollContent: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[4],
    gap: SizingScale[2],
    minWidth: "100%",
  },
});
