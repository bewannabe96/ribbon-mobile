import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useRef, useMemo, useEffect } from "react";
import { Color, Sizing, SizingScale } from "@/constants/theme";
import {
  SelectionModalFlow,
  SelectionModalFlowRef,
  OptionItem,
} from "@/components/selection-modal-flow";
import { useSearchFilters } from "@/views/search/context/use-search-filters";
import { SearchFilter } from "@/views/search/context/search-screen-context";
import Pill from "@/components/ui/pill";
import {
  CircleCheckBig,
  Hash,
  MapPin,
  Tag,
  UserRound,
} from "lucide-react-native";
import {
  DistrictSearchModalFlow,
  DistrictSearchModalFlowRef,
} from "@/components/district-search-modal-flow";
import { useDistrict } from "@/store";

const FEE_OPTIONS: OptionItem[] = [
  { label: "무료", value: "free" },
  { label: "5만원 이하", value: "under_50k" },
  { label: "5만원 이상", value: "over_50k" },
];

const THEME_OPTIONS: OptionItem[] = [
  { value: "art", label: "미술" },
  { value: "sports", label: "스포츠" },
  { value: "music", label: "음악" },
  { value: "cooking", label: "요리" },
  { value: "handicraft", label: "수공예" },
  { value: "tradition", label: "전통문화" },
  { value: "financial_management", label: "재테크/투자" },
  { value: "computer_technology", label: "IT/컴퓨터" },
  { value: "computer_software", label: "소프트웨어/프로그램" },
  { value: "ai", label: "AI/인공지능" },
  { value: "nature", label: "자연" },
  { value: "literature", label: "문학" },
  { value: "foreign_language", label: "외국어" },
  { value: "health", label: "건강/의료" },
  { value: "activity", label: "신체활동" },
  { value: "career", label: "진로/취업" },
  { value: "certificate", label: "자격증/면허증" },
  { value: "tax", label: "세무" },
  { value: "law", label: "법률/법무" },
  { value: "real_estate", label: "부동산" },
  { value: "social_welfare", label: "사회복지" },
];

const STATUS_OPTIONS: OptionItem[] = [
  { label: "접수예정", value: "upcoming" },
  { label: "접수중", value: "opened" },
];

const TARGET_OPTIONS: OptionItem[] = [
  { label: "주민대상", value: "residence_only" },
];

function getTagOptionItemFromFilter(filter: SearchFilter): OptionItem[] {
  return THEME_OPTIONS.filter((opt) => filter.tags.includes(opt.value));
}

function getFeeOptionItemFromFilter(filter: SearchFilter): OptionItem | null {
  if (filter.minFee === 0 && filter.maxFee === 0) {
    return FEE_OPTIONS[0];
  } else if (filter.minFee === null && filter.maxFee === 50000) {
    return FEE_OPTIONS[1];
  } else if (filter.minFee === 50000 && filter.maxFee === null) {
    return FEE_OPTIONS[2];
  } else {
    return null;
  }
}

function getStatusOptionItemFromFilter(
  filter: SearchFilter,
): OptionItem | null {
  if (filter.status === "upcoming") {
    return STATUS_OPTIONS[0];
  } else if (filter.status === "opened") {
    return STATUS_OPTIONS[1];
  } else {
    return null;
  }
}

function getTargetOptionItemsFromFilter(filter: SearchFilter): OptionItem[] {
  const optionItems: OptionItem[] = [];
  if (filter.residenceOnly) {
    optionItems.push(TARGET_OPTIONS[0]);
  }
  return optionItems;
}

export default function SubSearchFilters() {
  const { filter, dispatchFilter } = useSearchFilters();
  const { isInitialized, getLevelTwoDistrictsByIds } = useDistrict();

  const districtModalRef = useRef<DistrictSearchModalFlowRef>(null);
  const feeModalRef = useRef<SelectionModalFlowRef>(null);
  const tagModalRef = useRef<SelectionModalFlowRef>(null);
  const statusModalRef = useRef<SelectionModalFlowRef>(null);
  const targetModalRef = useRef<SelectionModalFlowRef>(null);

  const selectedDistricts = useMemo(
    () => getLevelTwoDistrictsByIds(filter.districts),
    [filter.districts, getLevelTwoDistrictsByIds],
  );

  const selectedFee = useMemo(() => {
    const optionItem = getFeeOptionItemFromFilter(filter);
    return optionItem === null ? [] : [optionItem];
  }, [filter]);

  const selectedTags = useMemo(
    () => getTagOptionItemFromFilter(filter),
    [filter],
  );

  const selectedStatus = useMemo(() => {
    const optionItem = getStatusOptionItemFromFilter(filter);
    return optionItem === null ? [] : [optionItem];
  }, [filter]);

  const selectedTargets = useMemo(() => {
    return getTargetOptionItemsFromFilter(filter);
  }, [filter]);

  const onDistrictPress = useCallback(async () => {
    const result = await districtModalRef.current?.open({
      initialSelected: filter.districts,
    });
    if (result) {
      dispatchFilter({ type: "SET_DISTRICTS", payload: result });
    }
  }, [filter.districts, dispatchFilter]);

  const onFeePress = useCallback(async () => {
    const result = await feeModalRef.current?.open({
      initialSelectedValues: selectedFee.map((c) => c.value),
    });
    if (result) {
      dispatchFilter({
        type: "SET_FEE_RANGE",
        payload:
          result[0] === "free"
            ? [0, 0]
            : result[0] === "under_50k"
              ? [null, 50000]
              : result[0] === "over_50k"
                ? [50000, null]
                : [null, null],
      });
    }
  }, [selectedFee, dispatchFilter]);

  const onTagPress = useCallback(async () => {
    const result = await tagModalRef.current?.open({
      initialSelectedValues: selectedTags.map((c) => c.value),
    });
    if (result) {
      dispatchFilter({ type: "SET_TAGS", payload: result });
    }
  }, [selectedTags, dispatchFilter]);

  const onStatusPress = useCallback(async () => {
    const result = await statusModalRef.current?.open({
      initialSelectedValues: selectedStatus.map((c) => c.value),
    });
    if (result) {
      dispatchFilter({
        type: "SET_STATUS",
        payload:
          result[0] === "upcoming"
            ? "upcoming"
            : result[0] === "opened"
              ? "opened"
              : null,
      });
    }
  }, [selectedStatus, dispatchFilter]);

  const onTargetPress = useCallback(async () => {
    const result = await targetModalRef.current?.open({
      initialSelectedValues: selectedTargets.map((c) => c.value),
    });
    if (result) {
      dispatchFilter({ type: "SET_TARGET", payload: result });
    }
  }, [selectedTargets, dispatchFilter]);

  const onSelectedDistrictPress = useCallback(
    (value: number) => {
      dispatchFilter({
        type: "SET_DISTRICTS",
        payload: filter.districts.filter((v) => v !== value),
      });
    },
    [dispatchFilter, filter.districts],
  );

  const onSelectedFeePress = useCallback(() => {
    dispatchFilter({ type: "SET_FEE_RANGE", payload: [null, null] });
  }, [dispatchFilter]);

  const onSelectedTagPress = useCallback(
    (value: string) => {
      dispatchFilter({
        type: "SET_TAGS",
        payload: selectedTags
          .filter((v) => v.value !== value)
          .map((v) => v.value),
      });
    },
    [dispatchFilter, selectedTags],
  );

  const onSelectedStatusPress = useCallback(() => {
    dispatchFilter({
      type: "SET_STATUS",
      payload: null,
    });
  }, [dispatchFilter]);

  const onSelectedTargetPress = useCallback(() => {
    dispatchFilter({ type: "SET_TARGET", payload: [] });
  }, [dispatchFilter]);

  const hasSelected = useMemo(() => {
    return (
      filter.districts.length +
        selectedFee.length +
        selectedTags.length +
        selectedStatus.length +
        selectedTargets.length >
      0
    );
  }, [
    selectedFee.length,
    filter.districts.length,
    selectedStatus.length,
    selectedTags.length,
    selectedTargets.length,
  ]);

  // const themeBackground = useThemeColor("background");
  // const themeBorder = useThemeColor("border");

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Color.text} />
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        horizontal
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        <Pill
          name="지역"
          IconComponent={<MapPin />}
          variant={filter.districts.length === 0 ? "outline" : "primary"}
          onPress={onDistrictPress}
        />
        <Pill
          name="가격"
          IconComponent={<Tag />}
          variant={selectedFee.length === 0 ? "outline" : "primary"}
          onPress={onFeePress}
        />
        <Pill
          name="분류"
          IconComponent={<Hash />}
          variant={selectedTags.length === 0 ? "outline" : "primary"}
          onPress={onTagPress}
        />
        <Pill
          name="신청상태"
          IconComponent={<CircleCheckBig />}
          variant={selectedStatus.length === 0 ? "outline" : "primary"}
          onPress={onStatusPress}
        />
        <Pill
          name="대상"
          IconComponent={<UserRound />}
          variant={selectedTargets.length === 0 ? "outline" : "primary"}
          onPress={onTargetPress}
        />
      </ScrollView>
      {hasSelected && (
        <View style={styles.selectedView}>
          <Text style={styles.selectedText}>적용된 필터:</Text>
          {selectedDistricts.map(({ id, name }) => (
            <Pill
              key={id}
              name={name}
              IconComponent={<MapPin />}
              size="sm"
              variant="secondary"
              onPress={onSelectedDistrictPress.bind(null, id)}
            />
          ))}
          {selectedFee.map((oi) => (
            <Pill
              key={oi.value}
              name={oi.label}
              IconComponent={<Tag />}
              size="sm"
              variant="secondary"
              onPress={onSelectedFeePress}
            />
          ))}
          {selectedTags.map((oi) => (
            <Pill
              key={oi.value}
              name={oi.label}
              IconComponent={<Hash />}
              size="sm"
              variant="secondary"
              onPress={onSelectedTagPress.bind(null, oi.value)}
            />
          ))}
          {selectedStatus.map((oi) => (
            <Pill
              key={oi.value}
              name={oi.label}
              IconComponent={<CircleCheckBig />}
              size="sm"
              variant="secondary"
              onPress={onSelectedStatusPress}
            />
          ))}
          {selectedTargets.map((oi) => (
            <Pill
              key={oi.value}
              name={oi.label}
              IconComponent={<UserRound />}
              size="sm"
              variant="secondary"
              onPress={onSelectedTargetPress}
            />
          ))}
        </View>
      )}

      {/* Selection Modals */}
      <DistrictSearchModalFlow ref={districtModalRef} />
      <SelectionModalFlow
        ref={tagModalRef}
        title="분류"
        options={THEME_OPTIONS}
        variant="multiple"
        allowSearch
      />
      <SelectionModalFlow
        ref={feeModalRef}
        title="비용"
        options={FEE_OPTIONS}
        variant="single"
      />
      <SelectionModalFlow
        ref={statusModalRef}
        title="신청상태"
        options={STATUS_OPTIONS}
        variant="single"
      />
      <SelectionModalFlow
        ref={targetModalRef}
        title="대상"
        options={TARGET_OPTIONS}
        variant="single"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: SizingScale[4],
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.background,
  },

  scrollView: {
    flexGrow: 0,
    borderBottomWidth: 1,
    backgroundColor: Color.background,
    borderColor: Color.border,
  },

  scrollContent: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[3],
    gap: SizingScale[2],
    minWidth: "100%",
  },

  selectedView: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[3],
    gap: SizingScale[2],
    borderBottomWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.background,
  },

  selectedText: {
    fontSize: 14,
    opacity: 0.75,
  },
});
