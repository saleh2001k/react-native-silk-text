//
//  SilkTextSwiftView.swift
//  react-native-silk-text
//
//  Fully-native per-letter text animation. The engine (split text -> animate a
//  0...1 `value` on every text change with an index-staggered spring) is ported
//  from the AnimateText SwiftUI library by jasu. The reveal is in-place
//  (fade + gentle scale/rise), so letters can flow and wrap like real text.
//

import SwiftUI
import UIKit

// MARK: - Observable model (bridged from React props)

final class SilkTextModel: ObservableObject {
  @Published var text: String = ""
  @Published var fontFamily: String = ""
  @Published var fontSize: CGFloat = 17
  @Published var fontWeightValue: Int = 400
  @Published var italic: Bool = false
  @Published var color: UIColor = .label
  @Published var frameAlignment: Alignment = .leading
  @Published var multilineAlignment: TextAlignment = .leading
  @Published var letterSpacing: CGFloat = 0
  @Published var lineHeight: CGFloat = 0
  @Published var numberOfLines: Int = 0
  @Published var adjustsFontSizeToFit: Bool = false
  @Published var minimumFontScale: CGFloat = 0.5
  @Published var ellipsizeMode: String = "tail"
  @Published var textTransform: String = "none"
  @Published var layoutDirection: LayoutDirection = .leftToRight
  @Published var animationType: String = "slide"
  @Published var duration: Double = 500 // milliseconds
  @Published var stagger: Double = 0.05 // seconds
  @Published var unit: String = "letters"
  @Published var animationEnabled: Bool = true

  var onComplete: ((String) -> Void)?
}

// MARK: - SwiftUI view

private struct WordGroup: Identifiable {
  let id: Int
  let cells: [String]
  let startIndex: Int
}

struct SilkSwiftTextView: View {
  @ObservedObject var model: SilkTextModel

  @State private var value: Double = 1

  var body: some View {
    GeometryReader { geo in
      let width = geo.size.width
      let size = fittedFontSize(width: width)
      let shown = truncatedText(transformed(model.text), font: uiFont(size), width: width)
      let groups = buildGroups(shown)

      Group {
        if #available(iOS 16.0, *) {
          FlowLayout(
            spacing: spaceWidth(size),
            lineSpacing: lineSpacingValue(size),
            alignment: horizontalAlignment()
          ) {
            cells(groups, size: size)
          }
        } else {
          HStack(spacing: 0) { cells(groups, size: size) }
        }
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: model.frameAlignment)
    }
    .environment(\.layoutDirection, model.layoutDirection)
    .onAppear { rebuild(animated: false) }
    .onChange(of: model.text) { _ in rebuild(animated: true) }
    .onChange(of: model.unit) { _ in rebuild(animated: false) }
  }

  @ViewBuilder
  private func cells(_ groups: [WordGroup], size: CGFloat) -> some View {
    ForEach(groups) { group in
      HStack(spacing: 0) {
        ForEach(Array(group.cells.enumerated()), id: \.offset) { ci, cell in
          styled(Text(cell), size: size)
            // In-place reveal: fade + gentle scale/rise. No travel from a
            // screen edge — each element settles where it belongs.
            .opacity(value)
            .scaleEffect(0.82 + 0.18 * value, anchor: .bottom)
            .offset(y: (1 - value) * 6)
            .animation(letterAnimation(index: group.startIndex + ci), value: value)
        }
      }
    }
  }

  // MARK: Engine

  private func rebuild(animated: Bool) {
    guard animated && model.animationEnabled else {
      value = 1
      return
    }
    value = 0
    DispatchQueue.main.async {
      withAnimation { value = 1 }
    }
    let total = model.duration / 1000.0
      + Double(max(cellCount(model.text) - 1, 0)) * model.stagger
    let captured = model.text
    DispatchQueue.main.asyncAfter(deadline: .now() + total) {
      if captured == model.text { model.onComplete?(captured) }
    }
  }

  /// Group the text into atomic word units; each word holds its animated cells
  /// (letters, or the whole word for connected scripts / `unit == words`).
  private func buildGroups(_ text: String) -> [WordGroup] {
    let words = text.components(separatedBy: " ").filter { !$0.isEmpty }
    var groups: [WordGroup] = []
    var running = 0
    for (i, word) in words.enumerated() {
      let cells: [String]
      if model.unit == "words" || isConnectedScript(word) {
        cells = [word]
      } else {
        cells = word.map { String($0) }
      }
      groups.append(WordGroup(id: i, cells: cells, startIndex: running))
      running += cells.count
    }
    if model.layoutDirection == .rightToLeft {
      return groups.reversed()
    }
    return groups
  }

  private func cellCount(_ text: String) -> Int {
    let words = text.components(separatedBy: " ").filter { !$0.isEmpty }
    var n = 0
    for w in words {
      n += (model.unit == "words" || isConnectedScript(w)) ? 1 : w.count
    }
    return n
  }

  private func isConnectedScript(_ text: String) -> Bool {
    for scalar in text.unicodeScalars {
      let v = scalar.value
      if (v >= 0x0600 && v <= 0x06FF) || // Arabic
        (v >= 0x0750 && v <= 0x077F) || // Arabic Supplement
        (v >= 0x08A0 && v <= 0x08FF) || // Arabic Extended-A
        (v >= 0xFB50 && v <= 0xFDFF) || // Arabic Presentation Forms-A
        (v >= 0xFE70 && v <= 0xFEFF) {  // Arabic Presentation Forms-B
        return true
      }
    }
    return false
  }

  private func letterAnimation(index: Int) -> Animation? {
    guard model.animationEnabled else { return nil }
    let response = max(model.duration / 1000.0, 0.05)
    return Animation
      .spring(response: response, dampingFraction: 0.7)
      .delay(Double(index) * model.stagger)
  }

  // MARK: Fit & truncation (native text measurement)

  private func fittedFontSize(width: CGFloat) -> CGFloat {
    guard model.adjustsFontSizeToFit, model.numberOfLines > 0, width > 0 else {
      return model.fontSize
    }
    let full = transformed(model.text)
    if lineCount(full, font: uiFont(model.fontSize), width: width) <= model.numberOfLines {
      return model.fontSize
    }
    var lo = max(model.minimumFontScale, 0.05)
    var hi: CGFloat = 1.0
    for _ in 0..<12 {
      let mid = (lo + hi) / 2
      if lineCount(full, font: uiFont(model.fontSize * mid), width: width) <= model.numberOfLines {
        lo = mid
      } else {
        hi = mid
      }
    }
    return model.fontSize * lo
  }

  private func truncatedText(_ text: String, font: UIFont, width: CGFloat) -> String {
    guard model.numberOfLines > 0, width > 0 else { return text }
    if lineCount(text, font: font, width: width) <= model.numberOfLines { return text }

    let suffix = model.ellipsizeMode == "clip" ? "" : "…"
    let chars = Array(text)
    var lo = 0
    var hi = chars.count
    while lo < hi {
      let mid = (lo + hi + 1) / 2
      let candidate = String(chars[0..<mid]) + suffix
      if lineCount(candidate, font: font, width: width) <= model.numberOfLines {
        lo = mid
      } else {
        hi = mid - 1
      }
    }
    return String(chars[0..<lo]) + suffix
  }

  private func lineCount(_ s: String, font: UIFont, width: CGFloat) -> Int {
    if s.isEmpty || width <= 0 { return 1 }
    var attrs: [NSAttributedString.Key: Any] = [.font: font]
    if model.letterSpacing != 0 { attrs[.kern] = model.letterSpacing }
    let rect = (s as NSString).boundingRect(
      with: CGSize(width: width, height: .greatestFiniteMagnitude),
      options: [.usesLineFragmentOrigin, .usesFontLeading],
      attributes: attrs,
      context: nil
    )
    return max(1, Int((rect.height / font.lineHeight).rounded(.up)))
  }

  // MARK: Styling

  private func styled(_ text: Text, size: CGFloat) -> some View {
    var t = text
      .font(resolvedFont(size))
      .foregroundColor(Color(model.color))
    if model.italic { t = t.italic() }
    if #available(iOS 16.0, *), model.letterSpacing != 0 {
      t = t.kerning(model.letterSpacing)
    }
    return t.multilineTextAlignment(model.multilineAlignment)
  }

  private func resolvedFont(_ size: CGFloat) -> Font {
    if !model.fontFamily.isEmpty {
      return Font.custom(model.fontFamily, size: size).weight(swiftWeight(model.fontWeightValue))
    }
    return Font.system(size: size, weight: swiftWeight(model.fontWeightValue))
  }

  private func uiFont(_ size: CGFloat) -> UIFont {
    var font: UIFont
    if !model.fontFamily.isEmpty, let custom = UIFont(name: model.fontFamily, size: size) {
      font = custom
    } else {
      font = UIFont.systemFont(ofSize: size, weight: uiWeight(model.fontWeightValue))
    }
    if model.italic,
       let d = font.fontDescriptor.withSymbolicTraits(
        font.fontDescriptor.symbolicTraits.union(.traitItalic)) {
      font = UIFont(descriptor: d, size: size)
    }
    return font
  }

  private func spaceWidth(_ size: CGFloat) -> CGFloat {
    (" " as NSString).size(withAttributes: [.font: uiFont(size)]).width
  }

  private func lineSpacingValue(_ size: CGFloat) -> CGFloat {
    if model.lineHeight > 0 {
      return max(0, model.lineHeight - uiFont(size).lineHeight)
    }
    return 2
  }

  private func horizontalAlignment() -> HorizontalAlignment {
    switch model.frameAlignment {
    case .center: return .center
    case .trailing: return .trailing
    default: return .leading
    }
  }

  private func swiftWeight(_ v: Int) -> Font.Weight {
    switch v {
    case ...100: return .thin
    case 101...200: return .ultraLight
    case 201...300: return .light
    case 301...400: return .regular
    case 401...500: return .medium
    case 501...600: return .semibold
    case 601...700: return .bold
    case 701...800: return .heavy
    default: return .black
    }
  }

  private func uiWeight(_ v: Int) -> UIFont.Weight {
    switch v {
    case ...100: return .thin
    case 101...200: return .ultraLight
    case 201...300: return .light
    case 301...400: return .regular
    case 401...500: return .medium
    case 501...600: return .semibold
    case 601...700: return .bold
    case 701...800: return .heavy
    default: return .black
    }
  }

  private func transformed(_ text: String) -> String {
    switch model.textTransform {
    case "uppercase": return text.uppercased()
    case "lowercase": return text.lowercased()
    case "capitalize": return text.capitalized
    default: return text
    }
  }
}

// MARK: - Wrapping flow layout (word-atomic)

@available(iOS 16.0, *)
private struct FlowLayout: Layout {
  var spacing: CGFloat
  var lineSpacing: CGFloat
  var alignment: HorizontalAlignment

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let maxWidth = proposal.width ?? .infinity
    let rows = arrange(subviews: subviews, maxWidth: maxWidth)
    let height = rows.map { $0.height }.reduce(0, +)
      + lineSpacing * CGFloat(max(rows.count - 1, 0))
    let width = rows.map { $0.width }.max() ?? 0
    return CGSize(width: min(width, maxWidth), height: height)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    let rows = arrange(subviews: subviews, maxWidth: bounds.width)
    var y = bounds.minY
    for row in rows {
      var x: CGFloat
      switch alignment {
      case .center: x = bounds.minX + (bounds.width - row.width) / 2
      case .trailing: x = bounds.maxX - row.width
      default: x = bounds.minX
      }
      for item in row.items {
        let s = subviews[item.index].sizeThatFits(.unspecified)
        subviews[item.index].place(
          at: CGPoint(x: x, y: y + (row.height - s.height) / 2),
          proposal: ProposedViewSize(s)
        )
        x += s.width + spacing
      }
      y += row.height + lineSpacing
    }
  }

  private struct Row { var items: [(index: Int, width: CGFloat)] = []; var width: CGFloat = 0; var height: CGFloat = 0 }

  private func arrange(subviews: Subviews, maxWidth: CGFloat) -> [Row] {
    var rows: [Row] = []
    var row = Row()
    for index in subviews.indices {
      let s = subviews[index].sizeThatFits(.unspecified)
      let projected = row.items.isEmpty ? s.width : row.width + spacing + s.width
      if !row.items.isEmpty && projected > maxWidth {
        rows.append(row)
        row = Row()
        row.items.append((index, s.width))
        row.width = s.width
        row.height = s.height
      } else {
        row.width = projected
        row.height = max(row.height, s.height)
        row.items.append((index, s.width))
      }
    }
    if !row.items.isEmpty { rows.append(row) }
    return rows
  }
}

// MARK: - Objective-C bridge

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
    default: // auto -> follow layout direction
      model.frameAlignment = model.layoutDirection == .rightToLeft ? .trailing : .leading
      model.multilineAlignment = .leading
    }
  }

  @objc public func setWritingDirection(_ value: NSString) {
    switch value as String {
    case "rtl": model.layoutDirection = .rightToLeft
    case "ltr": model.layoutDirection = .leftToRight
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
