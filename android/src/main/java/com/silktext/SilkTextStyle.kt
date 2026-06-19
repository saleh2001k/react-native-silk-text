package com.silktext

import android.graphics.Typeface
import androidx.compose.animation.core.Spring
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.sp
import kotlin.math.max

/** An atomic word unit holding its animated cells. */
data class SilkGroup(val cells: List<String>, val start: Int)

internal fun buildGroups(text: String, unit: String): List<SilkGroup> {
  val words = text.split(" ").filter { it.isNotEmpty() }
  val out = ArrayList<SilkGroup>()
  var running = 0
  for (w in words) {
    val cells = if (unit == "words" || isConnectedScript(w)) listOf(w) else w.map { it.toString() }
    out.add(SilkGroup(cells, running))
    running += cells.size
  }
  return out
}

internal fun lineCountOf(
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

internal fun fittedStyle(
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

internal fun truncate(
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

internal fun stiffnessFor(durationMs: Float): Float {
  val d = durationMs.coerceIn(100f, 2000f)
  return (Spring.StiffnessLow * (500f / d)).coerceIn(20f, 4000f)
}

internal fun transform(text: String, mode: String): String = when (mode) {
  "uppercase" -> text.uppercase()
  "lowercase" -> text.lowercase()
  "capitalize" -> text.split(" ").joinToString(" ") { w ->
    w.replaceFirstChar { it.uppercase() }
  }
  else -> text
}

internal fun isConnectedScript(text: String): Boolean = text.any { ch ->
  val v = ch.code
  (v in 0x0600..0x06FF) || // Arabic
    (v in 0x0750..0x077F) || // Arabic Supplement
    (v in 0x08A0..0x08FF) || // Arabic Extended-A
    (v in 0xFB50..0xFDFF) || // Arabic Presentation Forms-A
    (v in 0xFE70..0xFEFF) // Arabic Presentation Forms-B
}

internal fun buildTextStyle(model: SilkTextViewModel): TextStyle = TextStyle(
  color = model.color?.let { Color(it) } ?: Color.Black,
  fontSize = model.fontSize.sp,
  fontWeight = FontWeight(model.fontWeight.coerceIn(1, 1000)),
  fontStyle = if (model.italic) FontStyle.Italic else FontStyle.Normal,
  fontFamily = resolveFontFamily(model.fontFamily),
  letterSpacing = if (model.letterSpacing == 0f) 0.sp else model.letterSpacing.sp,
  lineHeight = if (model.lineHeight == 0f) TextUnit.Unspecified else model.lineHeight.sp,
  textAlign = composeTextAlign(model.textAlign)
)

internal fun resolveFontFamily(name: String): FontFamily = when {
  name.isEmpty() -> FontFamily.Default
  name == "serif" -> FontFamily.Serif
  name == "monospace" -> FontFamily.Monospace
  name == "sans-serif" -> FontFamily.SansSerif
  else -> FontFamily(Typeface.create(name, Typeface.NORMAL))
}

internal fun composeTextAlign(align: String): TextAlign = when (align) {
  "center" -> TextAlign.Center
  "right" -> TextAlign.Right
  "justify" -> TextAlign.Justify
  "left" -> TextAlign.Left
  else -> TextAlign.Start
}

internal fun flowAlign(model: SilkTextViewModel): Int = when (model.textAlign) {
  "center" -> 1
  "right" -> 2
  else -> 0
}

internal fun layoutDirectionOf(model: SilkTextViewModel): LayoutDirection =
  if (model.writingDirection == "rtl") LayoutDirection.Rtl else LayoutDirection.Ltr

internal fun boxAlignment(model: SilkTextViewModel): Alignment = when (model.textAlign) {
  "center" -> Alignment.Center
  "right" -> Alignment.CenterEnd
  else -> if (model.writingDirection == "rtl") Alignment.CenterEnd else Alignment.CenterStart
}
