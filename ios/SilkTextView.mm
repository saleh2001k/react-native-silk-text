#import "SilkTextView.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/SilkTextViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/SilkTextViewSpec/EventEmitters.h>
#import <react/renderer/components/SilkTextViewSpec/Props.h>
#import <react/renderer/components/SilkTextViewSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

// Generated Swift interop header (module name == pod name "SilkText").
#if __has_include("SilkText/SilkText-Swift.h")
#import "SilkText/SilkText-Swift.h"
#else
#import "SilkText-Swift.h"
#endif

using namespace facebook::react;

@interface SilkTextView () <RCTSilkTextViewViewProtocol>
@end

@implementation SilkTextView {
  SilkTextViewBridge *_bridge;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<SilkTextViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const SilkTextViewProps>();
    _props = defaultProps;

    _bridge = [[SilkTextViewBridge alloc] init];

    __weak SilkTextView *weakSelf = self;
    _bridge.onAnimationComplete = ^(NSString *text) {
      SilkTextView *strongSelf = weakSelf;
      if (!strongSelf || !strongSelf->_eventEmitter) {
        return;
      }
      SilkTextViewEventEmitter::OnAnimationComplete event = {
        .text = std::string([text UTF8String]),
      };
      std::dynamic_pointer_cast<const SilkTextViewEventEmitter>(strongSelf->_eventEmitter)
        ->onAnimationComplete(event);
    };

    self.contentView = _bridge.view;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<SilkTextViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<SilkTextViewProps const>(props);

  if (oldViewProps.text != newViewProps.text) {
    [_bridge setText:RCTNSStringFromString(newViewProps.text)];
  }
  if (oldViewProps.color != newViewProps.color) {
    UIColor *c = RCTUIColorFromSharedColor(newViewProps.color);
    [_bridge setTextColor:(c ?: [UIColor labelColor])];
  }
  if (oldViewProps.fontFamily != newViewProps.fontFamily) {
    [_bridge setFontFamily:RCTNSStringFromString(newViewProps.fontFamily)];
  }
  if (oldViewProps.fontSize != newViewProps.fontSize) {
    [_bridge setFontSize:newViewProps.fontSize];
  }
  if (oldViewProps.fontWeight != newViewProps.fontWeight) {
    [_bridge setFontWeight:RCTNSStringFromString(newViewProps.fontWeight)];
  }
  if (oldViewProps.fontStyle != newViewProps.fontStyle) {
    [_bridge setFontStyle:RCTNSStringFromString(newViewProps.fontStyle)];
  }
  if (oldViewProps.textAlign != newViewProps.textAlign) {
    [_bridge setTextAlign:RCTNSStringFromString(newViewProps.textAlign)];
  }
  if (oldViewProps.letterSpacing != newViewProps.letterSpacing) {
    [_bridge setLetterSpacing:newViewProps.letterSpacing];
  }
  if (oldViewProps.lineHeight != newViewProps.lineHeight) {
    [_bridge setLineHeight:newViewProps.lineHeight];
  }
  if (oldViewProps.numberOfLines != newViewProps.numberOfLines) {
    [_bridge setNumberOfLines:newViewProps.numberOfLines];
  }
  if (oldViewProps.adjustsFontSizeToFit != newViewProps.adjustsFontSizeToFit) {
    [_bridge setAdjustsFontSizeToFit:newViewProps.adjustsFontSizeToFit];
  }
  if (oldViewProps.minimumFontScale != newViewProps.minimumFontScale) {
    [_bridge setMinimumFontScale:newViewProps.minimumFontScale];
  }
  if (oldViewProps.ellipsizeMode != newViewProps.ellipsizeMode) {
    [_bridge setEllipsizeMode:RCTNSStringFromString(newViewProps.ellipsizeMode)];
  }
  if (oldViewProps.textTransform != newViewProps.textTransform) {
    [_bridge setTextTransform:RCTNSStringFromString(newViewProps.textTransform)];
  }
  if (oldViewProps.writingDirection != newViewProps.writingDirection) {
    [_bridge setWritingDirection:RCTNSStringFromString(newViewProps.writingDirection)];
  }
  if (oldViewProps.animationType != newViewProps.animationType) {
    [_bridge setAnimationType:RCTNSStringFromString(newViewProps.animationType)];
  }
  if (oldViewProps.animationDuration != newViewProps.animationDuration) {
    [_bridge setAnimationDuration:newViewProps.animationDuration];
  }
  if (oldViewProps.animationStagger != newViewProps.animationStagger) {
    [_bridge setAnimationStagger:newViewProps.animationStagger];
  }
  if (oldViewProps.unit != newViewProps.unit) {
    [_bridge setUnit:RCTNSStringFromString(newViewProps.unit)];
  }
  if (oldViewProps.animationEnabled != newViewProps.animationEnabled) {
    [_bridge setAnimationEnabled:newViewProps.animationEnabled];
  }

  [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> SilkTextViewCls(void)
{
  return SilkTextView.class;
}
