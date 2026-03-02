import { Platform } from 'react-native';

const tintColorLight = '#0E7A60';
const tintColorDark = '#7BE0C6';

export const Colors = {
  light: {
    text: '#10231E',
    background: '#F4FBF8',
    tint: tintColorLight,
    icon: '#5A6D66',
    tabIconDefault: '#7C8F88',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    border: '#D5E5DF',
    muted: '#6D7F78',
  },
  dark: {
    text: '#F2FFF9',
    background: '#0E1F1B',
    tint: tintColorDark,
    icon: '#A4BCB4',
    tabIconDefault: '#93A9A2',
    tabIconSelected: tintColorDark,
    card: '#17312B',
    border: '#264841',
    muted: '#B2C9C1',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
