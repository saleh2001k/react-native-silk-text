import { AnimatedText } from './AnimatedText';

export { AnimatedText };
export default AnimatedText;

/** Low-level native component (flat props). Prefer `AnimatedText`. */
export { SilkTextView } from './SilkTextView';

export type {
  AnimatedTextProps,
  SilkAnimationConfig,
  SilkAnimationType,
  SilkUnit,
} from './types';
