import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createFlow, FlowProps, FlowRef } from "@/components/ui/flow";
import { Color, Sizing, SizingScale, StaticColor } from "@/constants/theme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import Button from "@/components/ui/button";
import Pill from "@/components/ui/pill";
import { useDistrict } from "@/store";
import { Check, Search, X } from "lucide-react-native";

type DistrictSearchModalFlowProps = {};

type InputData = {
  initialSelected: number[];
};

type OutputData = number[];

type LevelOneDistrictItemProps = {
  name: string;
  isSelected: boolean;
  onPress: () => void;
};

function LevelOneDistrictItem(props: LevelOneDistrictItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={props.onPress}
      style={[
        cityItemStyles.container,
        props.isSelected && cityItemStyles.selectedContainer,
      ]}
    >
      <View style={cityItemStyles.content}>
        <Text
          style={[
            cityItemStyles.text,
            props.isSelected && cityItemStyles.selectedText,
          ]}
        >
          {props.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const cityItemStyles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[4],
  },

  selectedContainer: {
    backgroundColor: StaticColor.indigo600,
  },

  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    lineHeight: 17,
    color: Color.text,
  },

  selectedText: {
    color: Color.background,
  },
});

type LevelTwoDistrictItemProps = {
  name: string;
  isSelected: boolean;
  onPress: () => void;
};

function LevelTwoDistrictItem(props: LevelTwoDistrictItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={props.onPress}
      style={[
        districtItemStyles.container,
        props.isSelected && districtItemStyles.selectedContainer,
      ]}
    >
      <View style={districtItemStyles.content}>
        <Text
          style={[
            districtItemStyles.text,
            props.isSelected && districtItemStyles.selectedText,
          ]}
        >
          {props.name}
        </Text>
        {props.isSelected && <Check size={16} color={StaticColor.indigo600} />}
      </View>
    </TouchableOpacity>
  );
}

const districtItemStyles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[4],
  },

  selectedContainer: {
    backgroundColor: StaticColor.indigo50,
  },

  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    lineHeight: 17,
    color: Color.text,
  },

  selectedText: {
    color: StaticColor.indigo900,
  },
});

type SearchResultItemProps = {
  name: string;
  parentName: string;
  isSelected: boolean;
  onPress: () => void;
};

function SearchResultItem(props: SearchResultItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={props.onPress}
      style={[
        searchResultItemStyles.container,
        props.isSelected && searchResultItemStyles.selectedContainer,
      ]}
    >
      <View style={searchResultItemStyles.content}>
        <View>
          <Text style={searchResultItemStyles.cityText}>
            {props.parentName}
          </Text>
          <Text style={searchResultItemStyles.districtText}>{props.name}</Text>
        </View>
        {props.isSelected && <Check size={20} color={StaticColor.indigo600} />}
      </View>
    </TouchableOpacity>
  );
}

const searchResultItemStyles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[4],
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },

  selectedContainer: {
    backgroundColor: StaticColor.indigo50,
  },

  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cityText: {
    fontSize: 14,
    color: StaticColor.gray500,
    marginBottom: SizingScale[1],
  },

  districtText: {
    fontSize: 16,
    color: Color.text,
  },
});

function FlowContent(
  props: FlowProps<DistrictSearchModalFlowProps, InputData, OutputData>,
) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const {
    isInitialized,
    getLevelOneDistricts,
    getLevelTwoDistricts,
    getLevelTwoDistrictsByIds,
    searchDistricts,
  } = useDistrict();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDistrictIds, setSelectedDistrictIds] = useState<number[]>([]);
  const [selectedLevelOne, setSelectedLevelOne] = useState<number>(1);

  useEffect(() => {
    if (props.isOpened) {
      setSelectedDistrictIds(props.input?.initialSelected ?? []);
      setSearchQuery("");
      setSelectedLevelOne(1);
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.close();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpened]);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    props.close().then();
  }, [props]);

  const handleApply = useCallback(() => {
    Keyboard.dismiss();
    props.close(selectedDistrictIds).then();
  }, [selectedDistrictIds, props]);

  const handleReset = useCallback(() => {
    setSelectedLevelOne(1);
    setSelectedDistrictIds([]);
    setSearchQuery("");
  }, []);

  const toggleDistrict = useCallback(
    (districtId: number) => {
      setSelectedDistrictIds(
        selectedDistrictIds.includes(districtId)
          ? selectedDistrictIds.filter((v) => v !== districtId)
          : [...selectedDistrictIds, districtId],
      );
    },
    [selectedDistrictIds],
  );

  const levelOneDistricts = useMemo(
    () => getLevelOneDistricts(),
    [getLevelOneDistricts],
  );

  const searchResults = useMemo(
    () => searchDistricts(searchQuery),
    [searchQuery, searchDistricts],
  );

  const isSearching = useMemo(() => searchQuery.trim() !== "", [searchQuery]);

  const levelTwoDistricts = useMemo(
    () => getLevelTwoDistricts(selectedLevelOne),
    [selectedLevelOne, getLevelTwoDistricts],
  );

  const selectedDistricts = useMemo(
    () => getLevelTwoDistrictsByIds(selectedDistrictIds),
    [selectedDistrictIds, getLevelTwoDistrictsByIds],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={["90%"]}
      overDragResistanceFactor={0}
      enableDynamicSizing={false}
      enablePanDownToClose
      onDismiss={handleClose}
      backdropComponent={renderBackdrop}
      handleComponent={null}
      backgroundStyle={styles.modal}
      stackBehavior="push"
    >
      <BottomSheetView style={styles.contentView}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.headerText}>지역</Text>
          <TouchableOpacity onPress={handleClose}>
            <X color={Color.text} size={24} />
          </TouchableOpacity>
        </View>

        {!isInitialized && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Color.text} />
          </View>
        )}

        {isInitialized && (
          <>
            {/* Search Input */}
            <View style={styles.searchView}>
              <View style={styles.searchContainer}>
                <Search color={Color.text} size={20} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="검색"
                  placeholderTextColor={StaticColor.gray400}
                  // value={searchQuery} //! Cannot set due to `BottomSheetModal` behaviour
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Content */}
            <View style={styles.bodyView}>
              {isSearching && (
                <>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>
                      검색 결과 ({searchResults.length})
                    </Text>
                  </View>
                  {searchResults.length > 0 ? (
                    <BottomSheetScrollView>
                      {searchResults.map((item) => (
                        <SearchResultItem
                          key={item.id}
                          name={item.name}
                          parentName={item.parentName}
                          isSelected={selectedDistrictIds.includes(item.id)}
                          onPress={toggleDistrict.bind(null, item.id)}
                        />
                      ))}
                    </BottomSheetScrollView>
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
                      <Text style={styles.emptySubtext}>
                        다른 검색어를 입력해보세요
                      </Text>
                    </View>
                  )}
                </>
              )}

              {!isSearching && (
                <View style={styles.splitContainer}>
                  <View style={styles.leftPanel}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderText}>시/도</Text>
                    </View>
                    <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                      {levelOneDistricts.map(({ id, name }) => (
                        <LevelOneDistrictItem
                          key={id}
                          name={name}
                          isSelected={selectedLevelOne === id}
                          onPress={() => setSelectedLevelOne(id)}
                        />
                      ))}
                    </BottomSheetScrollView>
                  </View>
                  <View style={styles.rightPanel}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderText}>구/군</Text>
                    </View>
                    <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                      {levelTwoDistricts.map(({ id, name }) => (
                        <LevelTwoDistrictItem
                          key={id}
                          name={name}
                          isSelected={selectedDistrictIds.includes(id)}
                          onPress={toggleDistrict.bind(null, id)}
                        />
                      ))}
                    </BottomSheetScrollView>
                  </View>
                </View>
              )}
            </View>

            {/* Selected */}
            {selectedDistrictIds.length > 0 && (
              <View style={styles.selectedContainer}>
                <View style={styles.selectedHeader}>
                  <Text style={styles.selectedHeaderText}>
                    선택된 지역 ({selectedDistrictIds.length})
                  </Text>
                </View>
                <View style={styles.selectedPillView}>
                  {selectedDistricts.map(({ id, name }) => (
                    <Pill
                      key={id}
                      name={name}
                      size="sm"
                      variant="primary"
                      onPress={toggleDistrict.bind(null, id)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Footer Buttons */}
          </>
        )}

        <View style={styles.buttonContainer}>
          <Button
            label="초기화"
            variant="outline"
            size="lg"
            flexFill
            onPress={handleReset}
          />
          <Button
            label={
              selectedDistrictIds.length > 0
                ? `적용하기 (${selectedDistrictIds.length})`
                : "적용하기"
            }
            variant="primary"
            size="lg"
            flexFill
            onPress={handleApply}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export type DistrictSearchModalFlowRef = FlowRef<InputData, OutputData>;

export const DistrictSearchModalFlow = createFlow<
  DistrictSearchModalFlowProps,
  InputData,
  OutputData
>("DistrictSearchModalFlow", FlowContent);

const styles = StyleSheet.create({
  modal: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: Color.background,
  },

  contentView: {
    paddingBottom: SizingScale[8],
    height: "100%",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[5],
  },

  headerText: {
    color: Color.text,
    fontSize: 20,
    fontWeight: "bold",
  },

  closeButton: {
    padding: SizingScale[2],
    borderRadius: 20,
  },

  searchView: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingBottom: SizingScale[5],
  },

  searchContainer: {
    backgroundColor: Color.surface,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: SizingScale[3],
    height: 44,
    gap: SizingScale[2],
    borderWidth: 1,
    borderColor: StaticColor.gray300,
    overflow: "hidden",
  },

  searchInput: {
    color: Color.text,
    flex: 1,
    fontSize: 16,
    height: 44,
    paddingVertical: 0,
  },

  selectedContainer: {
    backgroundColor: StaticColor.indigo50,
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[3],
    borderTopWidth: 1,
    borderColor: Color.border,
  },

  selectedHeader: {
    paddingHorizontal: SizingScale[1],
    marginBottom: SizingScale[1.5],
  },

  selectedHeaderText: {
    fontSize: 16,
    color: StaticColor.indigo600,
  },

  selectedPillView: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SizingScale[2],
  },

  bodyView: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: Color.border,
  },

  sectionHeader: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[2.5],
    borderBottomWidth: 1,
    borderColor: Color.border,
    backgroundColor: StaticColor.gray50,
  },

  sectionHeaderText: {
    fontSize: 16,
    color: StaticColor.gray600,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SizingScale[1.5],
  },

  emptyText: {
    fontSize: 20,
    color: StaticColor.gray600,
  },

  emptySubtext: {
    fontSize: 14,
    color: StaticColor.gray600,
  },

  splitContainer: {
    flex: 1,
    flexDirection: "row",
  },

  leftPanel: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: Color.border,
  },

  rightPanel: {
    flex: 1,
  },

  buttonContainer: {
    paddingHorizontal: Sizing.screenPaddingX,
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: Color.border,
  },
});
