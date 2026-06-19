#import "SilkNumberView.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/SilkTextViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/SilkTextViewSpec/EventEmitters.h>
#import <react/renderer/components/SilkTextViewSpec/Props.h>
#import <react/renderer/components/SilkTextViewSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#if __has_include("SilkText/SilkText-Swift.h")
#import "SilkText/SilkText-Swift.h"
#else
#import "SilkText-Swift.h"
#endif

using namespace facebook::react;

@interface SilkNumberView () <RCTSilkNumberViewViewProtocol>
@end

@implementation SilkNumberView {
  SilkNumberViewBridge *_bridge;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<SilkNumberViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const SilkNumberViewProps>();
    _props = defaultProps;

    _bridge = [[SilkNumberViewBridge alloc] init];

    __weak SilkNumberView *weakSelf = self;
    _bridge.onCounterEnd = ^(double value) {
      SilkNumberView *strongSelf = weakSelf;
      if (!strongSelf || !strongSelf->_eventEmitter) {
        return;
      }
      SilkNumberViewEventEmitter::OnCounterEnd event = { .value = value };
      std::dynamic_pointer_cast<const SilkNumberViewEventEmitter>(strongSelf->_eventEmitter)
        ->onCounterEnd(event);
    };

    self.contentView = _bridge.view;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<SilkNumberViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<SilkNumberViewProps const>(props);

  if (oldViewProps.from != newViewProps.from) {
    [_bridge setFromValue:newViewProps.from];
  }
  if (oldViewProps.duration != newViewProps.duration) {
    [_bridge setDuration:newViewProps.duration];
  }
  if (oldViewProps.delay != newViewProps.delay) {
    [_bridge setDelayMs:newViewProps.delay];
  }
  if (oldViewProps.decimals != newViewProps.decimals) {
    [_bridge setDecimals:newViewProps.decimals];
  }
  if (oldViewProps.separator != newViewProps.separator) {
    [_bridge setSeparator:RCTNSStringFromString(newViewProps.separator)];
  }
  if (oldViewProps.prefix != newViewProps.prefix) {
    [_bridge setPrefix:RCTNSStringFromString(newViewProps.prefix)];
  }
  if (oldViewProps.suffix != newViewProps.suffix) {
    [_bridge setSuffix:RCTNSStringFromString(newViewProps.suffix)];
  }
  if (oldViewProps.animateOnMount != newViewProps.animateOnMount) {
    [_bridge setAnimateOnMount:newViewProps.animateOnMount];
  }
  if (oldViewProps.variant != newViewProps.variant) {
    [_bridge setVariant:RCTNSStringFromString(newViewProps.variant)];
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
  // value last so styling/config is applied before the roll begins.
  if (oldViewProps.value != newViewProps.value) {
    [_bridge setValue:newViewProps.value];
  }

  [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> SilkNumberViewCls(void)
{
  return SilkNumberView.class;
}
