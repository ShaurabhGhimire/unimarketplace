import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface Props {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  triggerStyle?: ViewStyle;
  triggerTextStyle?: TextStyle;
}

export function SelectModal({ value, options, onChange, triggerStyle, triggerTextStyle }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable style={[styles.trigger, triggerStyle]} onPress={() => setOpen(true)}>
        <Text style={[styles.triggerText, triggerTextStyle]} numberOfLines={1}>
          {value}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={24} color="#80889A" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {options.map((opt) => (
                <Pressable
                  key={opt}
                  style={[styles.option, opt === value && styles.optionSelected]}
                  onPress={() => {
                    onChange(opt);
                    setOpen(false);
                  }}>
                  <Text style={[styles.optionText, opt === value && styles.optionTextSelected]}>
                    {opt}
                  </Text>
                  {opt === value && <MaterialIcons name="check" size={18} color="#6368E8" />}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B8BDC8',
    paddingHorizontal: 14,
    backgroundColor: '#F8F9FC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {
    flex: 1,
    color: '#1E2942',
    fontSize: 15,
    marginRight: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
    maxHeight: '60%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionSelected: {
    backgroundColor: '#F0F1FD',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: '#1E2942',
  },
  optionTextSelected: {
    color: '#6368E8',
    fontWeight: '600',
  },
});
