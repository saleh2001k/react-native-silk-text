//
//  SilkFlowLayout.swift
//  react-native-silk-text
//
//  Word-atomic wrapping layout. Each child (a word) is packed greedily into
//  lines within the proposed width.
//

import SwiftUI

@available(iOS 16.0, *)
struct SilkFlowLayout: Layout {
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
