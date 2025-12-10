import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
} from "react-native";
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createFlow, FlowProps, FlowRef } from "@/components/ui/flow";
import { Color, Sizing, StaticColor } from "@/constants/theme";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { filterObjectsByJaso } from "@/lib/utils/korean-jaso-search";
import Button from "@/components/ui/button";
import { Check, Search, X } from "lucide-react-native";

export type OptionItem = {
  label: string;
  value: string;
};

export type DropdownVariant = "single" | "multiple";

type SelectionModalFlowProps = {
  title: string;
  options: OptionItem[];
  variant: DropdownVariant;
  allowSearch?: boolean;
  showSelectedFirst?: boolean;
  confirmOnSelect?: boolean;
};

type InputData = {
  initialSelectedValues: string[];
};

type OutputData = string[];

type SelectionItemProps = {
  item: OptionItem;
  isSelected: boolean;
  onPress: () => void;
};

function SelectionItem({ item, isSelected, onPress }: SelectionItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[
        selectionItemStyles.container,
        isSelected && {
          paddingHorizontal: 12,
          backgroundColor: StaticColor.indigo600,
        },
      ]}
    >
      <Text
        style={[
          selectionItemStyles.text,
          { color: isSelected ? Color.background : StaticColor.indigo600 },
        ]}
      >
        {item.label}
      </Text>
      {isSelected && <Check size={20} color={Color.background} />}
    </TouchableOpacity>
  );
}

const selectionItemStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    height: 44,
    borderRadius: 12,
  },

  text: {
    fontSize: 16,
  },
});

function FlowContent(
  props: FlowProps<SelectionModalFlowProps, InputData, OutputData>,
) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (props.isOpened) {
      setSelectedValues(props.input?.initialSelectedValues ?? []);
      setSearchQuery("");
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.close();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpened]);

  const handleItemPress = useCallback(
    (value: string) => {
      if (props.variant === "single") {
        if (props.confirmOnSelect) {
          props.close([value]).then();
        } else {
          setSelectedValues([value]);
        }
      } else {
        setSelectedValues((prev) =>
          prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value],
        );
      }
    },
    [props],
  );

  const handleReset = useCallback(() => {
    setSelectedValues([]);
  }, []);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    props.close().then();
  }, [props]);

  const handleApply = useCallback(() => {
    Keyboard.dismiss();
    props.close(selectedValues).then();
  }, [selectedValues, props]);

  const [sortedOptions, setSortedOptions] = useState<OptionItem[]>([]);

  useEffect(() => {
    if (!props.isOpened) return;
    if (!props.showSelectedFirst) {
      setSortedOptions(props.options);
      return;
    }

    const set = new Set(props.input?.initialSelectedValues);
    const selected: OptionItem[] = [];
    const unselected: OptionItem[] = [];
    for (const option of props.options) {
      if (set.has(option.value)) selected.push(option);
      else unselected.push(option);
    }
    setSortedOptions([...selected, ...unselected]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpened]);

  const filteredOptions = useMemo(() => {
    if (props.allowSearch && searchQuery.trim()) {
      return filterObjectsByJaso(
        searchQuery,
        sortedOptions,
        (option) => option.label,
      );
    } else {
      return sortedOptions;
    }
  }, [sortedOptions, props.allowSearch, searchQuery]);

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
      snapPoints={["75%"]}
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
          <Text style={styles.headerText}>{props.title}</Text>
          <TouchableOpacity onPress={handleClose}>
            <X color={Color.text} size={24} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        {props.allowSearch && (
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
        )}

        {/* Options List */}
        <BottomSheetFlatList
          data={filteredOptions}
          keyExtractor={(item: OptionItem) => item.value}
          renderItem={({ item }: { item: OptionItem }) => (
            <SelectionItem
              item={item}
              isSelected={selectedValues.includes(item.value)}
              onPress={() => handleItemPress(item.value)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separatorView} />}
          style={styles.optionsList}
          showsVerticalScrollIndicator={false}
        />

        {/* Confirmation Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            label="초기화"
            variant="outline"
            size="lg"
            flexFill
            onPress={handleReset}
          />
          {!props.confirmOnSelect && (
            <Button
              label="적용"
              variant="primary"
              size="lg"
              flexFill
              onPress={handleApply}
            />
          )}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export type SelectionModalFlowRef = FlowRef<InputData, OutputData>;

export const SelectionModalFlow = createFlow<
  SelectionModalFlowProps,
  InputData,
  OutputData
>("SelectionModalFlow", FlowContent);

const styles = StyleSheet.create({
  modal: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: Color.background,
  },

  contentView: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingTop: 20,
    paddingBottom: 36,
    height: "100%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  headerText: {
    color: Color.text,
    fontSize: 20,
    fontWeight: "bold",
  },

  searchView: {
    paddingBottom: 12,
  },

  searchContainer: {
    backgroundColor: Color.surface,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
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

  optionsList: {
    flex: 1,
  },

  separatorView: {
    height: 12,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
});
