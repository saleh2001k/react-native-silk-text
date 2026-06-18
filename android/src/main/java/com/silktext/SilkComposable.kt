package com.silktext

import android.graphics.Typeface
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.Placeable
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlin.math.max

/**
 * The native engine, ported from the AnimateText SwiftUI library. The text is
 * split into atomic word groups (each holding its animated cells — letters, or
 * the whole word for connected scripts / `unit == words`) and flowed through a
 * [FlowRow] so it wraps like real text. Font-fit and line-limit/ellipsize are
 * resolved up front with a [TextMeasurer] so the flow always fits.
 */
@Composable
fun SilkText(model: SilkTextViewModel) {
  val display = transform(model.text, model.textTransform)
  val baseStyle = buildStyle(model)
  val measurer = rememberTextMeasurer()
  val density = LocalDensity.current

  CompositionLocalProvider(LocalLayoutDirection provides layoutDirection(model)) {
    BoxWithConstraints(
      modifier = Modifier.fillMaxWidth(),
      contentAlignment = boxAlignment(model)
    ) {
      val widthPx = constraints.maxWidth
      val style = fittedStyle(model, baseStyle, display, widthPx, measurer)
      val shown = truncate(model, style, display, widthPx, measurer)
      val groups = buildGroups(shown, model.unit)

      val spacePx = measurer.measure(AnnotatedString(" "), style = style).size.width
      val linePx = with(density) { 2.dp.roundToPx() }

      LaunchedEffect(model.text, widthPx) {
        val cells = groups.sumOf { it.cells.size }
        if (!model.animationEnabled) {
          model.onComplete?.invoke(model.text)
          return@LaunchedEffect
        }
        val total = model.duration / 1000.0 +
          (cells - 1).coerceAtLeast(0) * model.stagger
        delay((total * 1000).toLong())
        model.onComplete?.invoke(model.text)
      }

      // Custom wrapping flow (avoids the version-fragile FlowRow overload).
      FlowLayout(
        modifier = Modifier.fillMaxWidth(),
        hSpacing = spacePx,
        vSpacing = linePx,
        align = flowAlign(model)
      ) {
        groups.forEach { group ->
          Row {
            group.cells.forEachIndexed { ci, cell ->
              AnimatedCell(
                text = cell,
                index = group.start + ci,
                model = model,
                style = style
              )
            }
          }
        }
      }
    }
  }
}

/**
 * Word-atomic wrapping layout. Each child is measured as an unbreakable unit
 * (a word) and greedily packed into lines within the incoming width. Uses
 * [Placeable.PlacementScope.placeRelative] so RTL is mirrored automatically.
 */
@Composable
private fun FlowLayout(
  modifier: Modifier,
  hSpacing: Int,
  vSpacing: Int,
  align: Int, // 0 = start, 1 = center, 2 = end
  content: @Composable () -> Unit
) {
  Layout(modifier = modifier, content = content) { measurables, constraints ->
    val maxWidth = constraints.maxWidth
    val childConstraints = Constraints(maxWidth = maxWidth)
    val placeables = measurables.map { it.measure(childConstraints) }

    val rows = ArrayList<MutableList<Placeable>>()
    var row = ArrayList<Placeable>()
    var rowWidth = 0
    for (p in placeables) {
      val projected = if (row.isEmpty()) p.width else rowWidth + hSpacing + p.width
      if (row.isNotEmpty() && projected > maxWidth) {
        rows.add(row)
        row = ArrayList()
        row.add(p)
        rowWidth = p.width
      } else {
        row.add(p)
        rowWidth = projected
      }
    }
    if (row.isNotEmpty()) rows.add(row)

    val rowHeights = rows.map { r -> r.maxOfOrNull { it.height } ?: 0 }
    val contentHeight = rowHeights.sum() + vSpacing * (rows.size - 1).coerceAtLeast(0)
    val width = if (maxWidth == Constraints.Infinity) {
      rows.maxOfOrNull { r -> r.sumOf { it.width } + hSpacing * (r.size - 1).coerceAtLeast(0) } ?: 0
    } else {
      maxWidth
    }
    val height = contentHeight.coerceIn(constraints.minHeight, constraints.maxHeight)

    layout(width, height) {
      var y = 0
      rows.forEachIndexed { ri, r ->
        val used = r.sumOf { it.width } + hSpacing * (r.size - 1).coerceAtLeast(0)
        var x = when (align) {
          1 -> (width - used) / 2
          2 -> width - used
          else -> 0
        }
        val rh = rowHeights[ri]
        for (p in r) {
          p.placeRelative(x, y + (rh - p.height) / 2)
          x += p.width + hSpacing
        }
        y += rh + vSpacing
      }
    }
  }
}

@Composable
private fun AnimatedCell(
  text: String,
  index: Int,
  model: SilkTextViewModel,
  style: TextStyle
) {
  val anim = remember(model.text, index) {
    Animatable(if (model.animationEnabled) 0f else 1f)
  }

  LaunchedEffect(model.text, index) {
    if (!model.animationEnabled) {
      anim.snapTo(1f)
      return@LaunchedEffect
    }
    anim.snapTo(0f)
    delay((index * model.stagger * 1000).toLong())
    anim.animateTo(
      targetValue = 1f,
      animationSpec = spring(
        dampingRatio = 0.7f,
        stiffness = stiffnessFor(model.duration)
      )
    )
  }

  val v = anim.value
  Text(
    text = text,
    style = style,
    softWrap = false,
    maxLines = 1,
    // In-place reveal: fade + gentle scale/rise. No travel from a screen edge.
    modifier = Modifier.graphicsLayer {
      alpha = v
      val s = 0.82f + 0.18f * v
      scaleX = s
      scaleY = s
      transformOrigin = TransformOrigin(0.5f, 1f)
      translationY = (1f - v) * 6.dp.toPx()
    }
  )
}

// MARK: Fit & truncation

private data class Group(val cells: List<String>, val start: Int)

private fun buildGroups(text: String, unit: String): List<Group> {
  val words = text.split(" ").filter { it.isNotEmpty() }
  val out = ArrayList<Group>()
  var running = 0
  for (w in words) {
    val cells = if (unit == "words" || isConnectedScript(w)) listOf(w) else w.map { it.toString() }
    out.add(Group(cells, running))
    running += cells.size
  }
  return out
}

private fun lineCountOf(
  measurer: TextMeasurer,
  text: String,
  style: TextStyle,
  widthPx: Int
): Int {
  if (text.isEmpty() || widthPx <= 0) return 1
  return measurer.measure(
    text = AnnotatedString(text),
    style = style,
    constraints = Constraints(maxWidth = widthPx)
  ).lineCount
}

private fun fittedStyle(
  model: SilkTextViewModel,
  base: TextStyle,
  text: String,
  widthPx: Int,
  measurer: TextMeasurer
): TextStyle {
  if (!model.adjustsFontSizeToFit || model.numberOfLines <= 0 || widthPx <= 0) return base
  if (lineCountOf(measurer, text, base, widthPx) <= model.numberOfLines) return base
  var lo = max(model.minimumFontScale, 0.05f)
  var hi = 1f
  repeat(12) {
    val mid = (lo + hi) / 2f
    val candidate = base.copy(fontSize = (model.fontSize * mid).sp)
    if (lineCountOf(measurer, text, candidate, widthPx) <= model.numberOfLines) lo = mid else hi = mid
  }
  return base.copy(fontSize = (model.fontSize * lo).sp)
}

private fun truncate(
  model: SilkTextViewModel,
  style: TextStyle,
  text: String,
  widthPx: Int,
  measurer: TextMeasurer
): String {
  if (model.numberOfLines <= 0 || widthPx <= 0) return text
  if (lineCountOf(measurer, text, style, widthPx) <= model.numberOfLines) return text
  val suffix = if (model.ellipsizeMode == "clip") "" else "…"
  var lo = 0
  var hi = text.length
  while (lo < hi) {
    val mid = (lo + hi + 1) / 2
    val candidate = text.substring(0, mid) + suffix
    if (lineCountOf(measurer, candidate, style, widthPx) <= model.numberOfLines) lo = mid else hi = mid - 1
  }
  return text.substring(0, lo) + suffix
}

private fun stiffnessFor(durationMs: Float): Float {
  // Map the requested duration onto a spring stiffness: shorter = snappier.
  val d = durationMs.coerceIn(100f, 2000f)
  return (Spring.StiffnessLow * (500f / d)).coerceIn(20f, 4000f)
}

private fun transform(text: String, mode: String): String = when (mode) {
  "uppercase" -> text.uppercase()
  "lowercase" -> text.lowercase()
  "capitalize" -> text.split(" ").joinToString(" ") { w ->
    w.replaceFirstChar { it.uppercase() }
  }
  else -> text
}

private fun isConnectedScript(text: String): Boolean = text.any { ch ->
  val v = ch.code
  (v in 0x0600..0x06FF) || // Arabic
    (v in 0x0750..0x077F) || // Arabic Supplement
    (v in 0x08A0..0x08FF) || // Arabic Extended-A
    (v in 0xFB50..0xFDFF) || // Arabic Presentation Forms-A
    (v in 0xFE70..0xFEFF) // Arabic Presentation Forms-B
}

private fun buildStyle(model: SilkTextViewModel): TextStyle {
  return TextStyle(
    color = model.color?.let { Color(it) } ?: Color.Black,
    fontSize = model.fontSize.sp,
    fontWeight = FontWeight(model.fontWeight.coerceIn(1, 1000)),
    fontStyle = if (model.italic) FontStyle.Italic else FontStyle.Normal,
    fontFamily = resolveFontFamily(model.fontFamily),
    letterSpacing = if (model.letterSpacing == 0f) 0.sp else model.letterSpacing.sp,
    lineHeight = if (model.lineHeight == 0f) androidx.compose.ui.unit.TextUnit.Unspecified
    else model.lineHeight.sp,
    textAlign = composeTextAlign(model.textAlign)
  )
}

private fun resolveFontFamily(name: String): FontFamily = when {
  name.isEmpty() -> FontFamily.Default
  name == "serif" -> FontFamily.Serif
  name == "monospace" -> FontFamily.Monospace
  name == "sans-serif" -> FontFamily.SansSerif
  else -> FontFamily(Typeface.create(name, Typeface.NORMAL))
}

private fun composeTextAlign(align: String): TextAlign = when (align) {
  "center" -> TextAlign.Center
  "right" -> TextAlign.Right
  "justify" -> TextAlign.Justify
  "left" -> TextAlign.Left
  else -> TextAlign.Start
}

private fun flowAlign(model: SilkTextViewModel): Int = when (model.textAlign) {
  "center" -> 1
  "right" -> 2
  else -> 0
}

private fun layoutDirection(model: SilkTextViewModel): LayoutDirection = when (model.writingDirection) {
  "rtl" -> LayoutDirection.Rtl
  "ltr" -> LayoutDirection.Ltr
  else -> LayoutDirection.Ltr
}

private fun boxAlignment(model: SilkTextViewModel): Alignment = when (model.textAlign) {
  "center" -> Alignment.Center
  "right" -> Alignment.CenterEnd
  else -> if (model.writingDirection == "rtl") Alignment.CenterEnd else Alignment.CenterStart
}
