//
//  SilkTextView+Render.swift
//  react-native-silk-text
//
//  The SwiftUI text view: self-animating per-letter cells flowed through
//  SilkFlowLayout, with native font-fit / line-limit / ellipsize.
//

import SwiftUI
import UIKit

// MARK: - Per-cell self-animating view (flip-up reveal)

private struct SilkCell: View {
  let text: String
  let index: Int
  let size: CGFloat
  @ObservedObject var model: SilkTextModel

  @State private var v: Double = 0

  var body: some View {
    styled()
      .opacity(v)
      // Flip-up reveal: each glyph rotates in around its baseline.
      .rotation3DEffect(
        .degrees((1 - v) * -82),
        axis: (x: 1, y: 0, z: 0),
        anchor: .bottom,
        perspective: 0.55
      )
      .onAppear { animateIn() }
      .onChange(of: model.text) { _ in
        v = 0
        animateIn()
      }
  }

  private func animateIn() {
    guard model.animationEnabled else { v = 1; return }
    let response = max(model.duration / 1000.0, 0.05)
    withAnimation(
      .spring(response: response, dampingFraction: 0.72)
        .delay(Double(index) * model.stagger)
    ) {
      v = 1
    }
  }

  private func styled() -> some View {
    var t = Text(text)
      .font(silkSwiftFont(model, size))
      .foregroundColor(Color(model.color))
    if model.italic { t = t.italic() }
    if #available(iOS 16.0, *), model.letterSpacing != 0 {
      t = t.kerning(model.letterSpacing)
    }
    return t
  }
}

// MARK: - Text view

struct SilkSwiftTextView: View {
  @ObservedObject var model: SilkTextModel

  var body: some View {
    GeometryReader { geo in
      let width = geo.size.width
      let size = fittedFontSize(width: width)
      let shown = truncatedText(transformed(model.text), font: uiFont(size), width: width)
      let groups = buildGroups(shown)

      Group {
        if #available(iOS 16.0, *) {
          SilkFlowLayout(
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
    .onChange(of: model.text) { _ in scheduleComplete() }
  }

  @ViewBuilder
  private func cells(_ groups: [SilkWordGroup], size: CGFloat) -> some View {
    ForEach(groups) { group in
      HStack(spacing: 0) {
        ForEach(Array(group.cells.enumerated()), id: \.offset) { ci, cell in
          SilkCell(text: cell, index: group.startIndex + ci, size: size, model: model)
        }
      }
    }
  }

  // MARK: Engine

  private func scheduleComplete() {
    guard model.animationEnabled else {
      model.onComplete?(model.text)
      return
    }
    let total = model.duration / 1000.0
      + Double(max(cellCount(model.text) - 1, 0)) * model.stagger
    let captured = model.text
    DispatchQueue.main.asyncAfter(deadline: .now() + total) {
      if captured == model.text { model.onComplete?(captured) }
    }
  }

  private func buildGroups(_ text: String) -> [SilkWordGroup] {
    let words = text.components(separatedBy: " ").filter { !$0.isEmpty }
    var groups: [SilkWordGroup] = []
    var running = 0
    for (i, word) in words.enumerated() {
      let cells = (model.unit == "words" || silkIsConnectedScript(word))
        ? [word] : word.map { String($0) }
      groups.append(SilkWordGroup(id: i, cells: cells, startIndex: running))
      running += cells.count
    }
    return model.layoutDirection == .rightToLeft ? groups.reversed() : groups
  }

  private func cellCount(_ text: String) -> Int {
    text.components(separatedBy: " ").filter { !$0.isEmpty }.reduce(0) { acc, w in
      acc + ((model.unit == "words" || silkIsConnectedScript(w)) ? 1 : w.count)
    }
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

  // MARK: Style helpers

  private func uiFont(_ size: CGFloat) -> UIFont {
    var font: UIFont
    if !model.fontFamily.isEmpty, let custom = UIFont(name: model.fontFamily, size: size) {
      font = custom
    } else {
      font = UIFont.systemFont(ofSize: size, weight: silkUIWeight(model.fontWeightValue))
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
    model.lineHeight > 0 ? max(0, model.lineHeight - uiFont(size).lineHeight) : 2
  }

  private func horizontalAlignment() -> HorizontalAlignment {
    switch model.frameAlignment {
    case .center: return .center
    case .trailing: return .trailing
    default: return .leading
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
