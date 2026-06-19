//
//  SilkTextModel.swift
//  react-native-silk-text
//
//  Observable state bridged from React props + shared font helpers.
//

import SwiftUI
import UIKit

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
  @Published var animationType: String = "flip"
  @Published var duration: Double = 500 // milliseconds
  @Published var stagger: Double = 0.05 // seconds
  @Published var unit: String = "letters"
  @Published var animationEnabled: Bool = true

  var onComplete: ((String) -> Void)?
}

/// An atomic word unit holding its animated cells.
struct SilkWordGroup: Identifiable {
  let id: Int
  let cells: [String]
  let startIndex: Int
}

// MARK: - Shared font helpers

func silkFont(_ family: String, _ size: CGFloat, _ weightValue: Int) -> Font {
  if !family.isEmpty {
    return Font.custom(family, size: size).weight(silkSwiftWeight(weightValue))
  }
  return Font.system(size: size, weight: silkSwiftWeight(weightValue))
}

func silkSwiftFont(_ model: SilkTextModel, _ size: CGFloat) -> Font {
  silkFont(model.fontFamily, size, model.fontWeightValue)
}

func silkWeightValue(from s: String) -> Int {
  switch s {
  case "normal": return 400
  case "bold": return 700
  default: return Int(s) ?? 400
  }
}

func silkSwiftWeight(_ v: Int) -> Font.Weight {
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

func silkUIWeight(_ v: Int) -> UIFont.Weight {
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

func silkIsConnectedScript(_ text: String) -> Bool {
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
