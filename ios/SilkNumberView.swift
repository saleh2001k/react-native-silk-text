//
//  SilkNumberView.swift
//  react-native-silk-text
//
//  Native animated counter with two variants:
//    • roll     – the value counts up/down smoothly (interpolated).
//    • odometer – each digit slides up/down on change (iOS 17 numericText).
//

import SwiftUI
import UIKit

// MARK: - Model

final class SilkNumberModel: ObservableObject {
  @Published var value: Double = 0
  @Published var from: Double = 0
  @Published var duration: Double = 2000 // ms
  @Published var delay: Double = 0 // ms
  @Published var decimals: Int = 0
  @Published var separator: String = ""
  @Published var prefix: String = ""
  @Published var suffix: String = ""
  @Published var animateOnMount: Bool = true
  @Published var variant: String = "roll"
  @Published var fontFamily: String = ""
  @Published var fontSize: CGFloat = 34
  @Published var fontWeightValue: Int = 700
  @Published var italic: Bool = false
  @Published var color: UIColor = .label
  @Published var alignment: TextAlignment = .leading

  var onEnd: ((Double) -> Void)?

  func format(_ v: Double) -> String {
    let f = NumberFormatter()
    f.numberStyle = .decimal
    f.minimumFractionDigits = decimals
    f.maximumFractionDigits = decimals
    f.usesGroupingSeparator = !separator.isEmpty
    if !separator.isEmpty { f.groupingSeparator = separator }
    f.groupingSize = 3
    return f.string(from: NSNumber(value: v)) ?? String(format: "%.\(decimals)f", v)
  }
}

// MARK: - View

struct SilkNumberSwiftView: View {
  @ObservedObject var model: SilkNumberModel

  var body: some View {
    Group {
      if model.variant == "odometer" {
        OdometerView(model: model)
      } else {
        RollView(model: model)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: frameAlignment(model))
  }
}

func silkNumberStyled(_ text: Text, _ model: SilkNumberModel) -> some View {
  var t = text
    .font(silkFont(model.fontFamily, model.fontSize, model.fontWeightValue))
    .foregroundColor(Color(model.color))
  if model.italic { t = t.italic() }
  return t.multilineTextAlignment(model.alignment)
}

func frameAlignment(_ model: SilkNumberModel) -> Alignment {
  switch model.alignment {
  case .center: return .center
  case .trailing: return .trailing
  default: return .leading
  }
}

// MARK: - Roll variant (interpolated count up/down)

private struct RollView: View {
  @ObservedObject var model: SilkNumberModel

  @State private var startDate = Date()
  @State private var fromValue: Double = 0
  @State private var toValue: Double = 0
  @State private var running = false
  @State private var didInit = false

  var body: some View {
    TimelineView(.animation(paused: !running)) { ctx in
      silkNumberStyled(Text(model.prefix + model.format(currentValue(ctx.date)) + model.suffix), model)
    }
    .onAppear {
      guard !didInit else { return }
      didInit = true
      begin(from: model.animateOnMount ? model.from : model.value, to: model.value)
    }
    .onChange(of: model.value) { newValue in
      begin(from: currentValue(Date()), to: newValue)
    }
  }

  private func begin(from: Double, to: Double) {
    fromValue = from
    toValue = to
    startDate = Date().addingTimeInterval(model.delay / 1000.0)
    running = true
    let totalMs = max(model.delay, 0) + max(model.duration, 0)
    DispatchQueue.main.asyncAfter(deadline: .now() + totalMs / 1000.0) {
      guard toValue == to else { return }
      running = false
      model.onEnd?(to)
    }
  }

  private func currentValue(_ now: Date) -> Double {
    let d = max(model.duration / 1000.0, 0.001)
    let elapsed = now.timeIntervalSince(startDate)
    if elapsed <= 0 { return fromValue }
    let t = min(elapsed / d, 1)
    let eased = 1 - pow(1 - t, 3)
    return fromValue + (toValue - fromValue) * eased
  }
}

// MARK: - Odometer variant (per-digit slide via numericText)

private struct OdometerView: View {
  @ObservedObject var model: SilkNumberModel

  @State private var displayValue: Double = 0
  @State private var didInit = false

  var body: some View {
    silkNumberStyled(Text(model.prefix + model.format(displayValue) + model.suffix), model)
      .modifier(NumericValueTransition(value: displayValue))
      .onAppear {
        guard !didInit else { return }
        didInit = true
        displayValue = model.animateOnMount ? model.from : model.value
        if model.animateOnMount { roll(to: model.value) } else { scheduleEnd() }
      }
      .onChange(of: model.value) { v in roll(to: v) }
  }

  private func roll(to v: Double) {
    withAnimation(spring()) { displayValue = v }
    scheduleEnd()
  }

  private func scheduleEnd() {
    let captured = model.value
    DispatchQueue.main.asyncAfter(deadline: .now() + max(model.duration, 0) / 1000.0) {
      guard captured == model.value else { return }
      model.onEnd?(captured)
    }
  }

  private func spring() -> Animation {
    .spring(response: max(model.duration / 1000.0, 0.05), dampingFraction: 0.9)
  }
}

private struct NumericValueTransition: ViewModifier {
  let value: Double
  func body(content: Content) -> some View {
    if #available(iOS 17.0, *) {
      content.contentTransition(.numericText(value: value))
    } else {
      content
    }
  }
}

// MARK: - Bridge

@objc public class SilkNumberViewBridge: NSObject {
  private let model = SilkNumberModel()
  private var hosting: UIHostingController<SilkNumberSwiftView>!

  @objc public var onCounterEnd: ((Double) -> Void)?

  @objc public override init() {
    super.init()
    model.onEnd = { [weak self] v in self?.onCounterEnd?(v) }
    hosting = UIHostingController(rootView: SilkNumberSwiftView(model: model))
    hosting.view.backgroundColor = .clear
  }

  @objc public var view: UIView { hosting.view }

  @objc public func setValue(_ value: Double) { model.value = value }
  @objc public func setFromValue(_ value: Double) { model.from = value }
  @objc public func setDuration(_ value: Double) { model.duration = value }
  @objc public func setDelayMs(_ value: Double) { model.delay = value }
  @objc public func setDecimals(_ value: Int) { model.decimals = value }
  @objc public func setSeparator(_ value: NSString) { model.separator = value as String }
  @objc public func setPrefix(_ value: NSString) { model.prefix = value as String }
  @objc public func setSuffix(_ value: NSString) { model.suffix = value as String }
  @objc public func setAnimateOnMount(_ value: Bool) { model.animateOnMount = value }
  @objc public func setVariant(_ value: NSString) { model.variant = value as String }
  @objc public func setFontFamily(_ value: NSString) { model.fontFamily = value as String }
  @objc public func setFontSize(_ value: CGFloat) { model.fontSize = value }
  @objc public func setFontStyle(_ value: NSString) { model.italic = (value as String) == "italic" }
  @objc public func setTextColor(_ value: UIColor) { model.color = value }
  @objc public func setFontWeight(_ value: NSString) {
    model.fontWeightValue = silkWeightValue(from: value as String)
  }
  @objc public func setTextAlign(_ value: NSString) {
    switch value as String {
    case "center": model.alignment = .center
    case "right": model.alignment = .trailing
    default: model.alignment = .leading
    }
  }
}
