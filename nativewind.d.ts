import 'react-native';
import { CSSProperties } from 'react';

declare module 'react' {
  // Allow `className` on React Native elements when using nativewind
  interface DOMAttributes<T> {
    className?: string;
  }

  interface HTMLAttributes<T> extends DOMAttributes<T> {
    className?: string;
    style?: CSSProperties;
  }
}

declare module 'react-native' {
  // Extend common native components' props with an optional className
  // so nativewind's `className` doesn't cause TS errors.
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface SafeAreaViewProps {
    className?: string;
  }
}
