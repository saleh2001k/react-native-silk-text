import { AnimatedText } from './AnimatedText';
import { AnimatedNumber } from './AnimatedNumber';

export { AnimatedText, AnimatedNumber };
export default AnimatedText;

/** Low-level native components (flat props). Prefer the wrappers above. */
export { SilkTextView } from './SilkTextView';
export { SilkNumberView } from './SilkNumberView';

export type {
  AnimatedTextProps,
  AnimatedNumberProps,
  SilkAnimationConfig,
  SilkAnimationType,
  SilkUnit,
} from './types';
