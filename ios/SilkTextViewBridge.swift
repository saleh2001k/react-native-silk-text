//
//  SilkTextViewBridge.swift
//  react-native-silk-text
//
//  Objective-C bridge: hosts the SwiftUI text view and maps React props.
//

import SwiftUI
import UIKit

@objc public class SilkTextViewBridge: NSObject {
  private let model = SilkTextModel()
  private var hosting: UIHostingController<SilkSwiftTextView>!

  /// Invoked when the staggered animation settles.
  @objc public var onAnimationComplete: ((NSString) -> Void)?

  @objc public override init() {
    super.init()
    model.onComplete = { [weak self] text in
      self?.onAnimationComplete?(text as NSString)
    }
    hosting = UIHostingController(rootView: SilkSwiftTextView(model: model))
    hosting.view.backgroundColor = .clear
  }

  @objc public var view: UIView { hosting.view }

  @objc public func setText(_ value: NSString) { model.text = value as String }
  @objc public func setFontFamily(_ value: NSString) { model.fontFamily = value as String }
  @objc public func setFontSize(_ value: CGFloat) { model.fontSize = value }
  @objc public func setFontStyle(_ value: NSString) { model.italic = (value as String) == "italic" }
  @objc public func setTextColor(_ value: UIColor) { model.color = value }
  @objc public func setLetterSpacing(_ value: CGFloat) { model.letterSpacing = value }
  @objc public func setLineHeight(_ value: CGFloat) { model.lineHeight = value }
  @objc public func setNumberOfLines(_ value: Int) { model.numberOfLines = value }
  @objc public func setAdjustsFontSizeToFit(_ value: Bool) { model.adjustsFontSizeToFit = value }
  @objc public func setMinimumFontScale(_ value: CGFloat) { model.minimumFontScale = value }
  @objc public func setEllipsizeMode(_ value: NSString) { model.ellipsizeMode = value as String }
  @objc public func setTextTransform(_ value: NSString) { model.textTransform = value as String }
  @objc public func setAnimationType(_ value: NSString) { model.animationType = value as String }
  @objc public func setAnimationDuration(_ value: Double) { model.duration = value }
  @objc public func setAnimationStagger(_ value: Double) { model.stagger = value }
  @objc public func setUnit(_ value: NSString) { model.unit = value as String }
  @objc public func setAnimationEnabled(_ value: Bool) { model.animationEnabled = value }

  @objc public func setFontWeight(_ value: NSString) {
    model.fontWeightValue = SilkTextViewBridge.weight(from: value as String)
  }

  @objc public func setTextAlign(_ value: NSString) {
    switch value as String {
    case "center":
      model.frameAlignment = .center
      model.multilineAlignment = .center
    case "right":
      model.frameAlignment = .trailing
      model.multilineAlignment = .trailing
    case "justify", "left":
      model.frameAlignment = .leading
      model.multilineAlignment = .leading
    default:
      model.frameAlignment = model.layoutDirection == .rightToLeft ? .trailing : .leading
      model.multilineAlignment = .leading
    }
  }

  @objc public func setWritingDirection(_ value: NSString) {
    switch value as String {
    case "rtl": model.layoutDirection = .rightToLeft
    default: model.layoutDirection = .leftToRight
    }
  }

  private static func weight(from s: String) -> Int {
    switch s {
    case "normal": return 400
    case "bold": return 700
    default: return Int(s) ?? 400
    }
  }
}
