package com.silktext

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.util.Locale
import kotlin.math.abs

/**
 * Native animated counter. `roll` eases the value smoothly; `odometer` slides
 * each digit up (increasing) or down (decreasing) independently — fixed-metric
 * slots + a spring keep the motion smooth, matching the iOS numericText feel.
 */
@Composable
fun SilkNumber(model: SilkNumberViewModel) {
  if (model.variant == "odometer") SilkOdometer(model) else SilkRoll(model)
}

// MARK: - Roll variant

@Composable
private fun SilkRoll(model: SilkNumberViewModel) {
  val anim = remember {
    Animatable(if (model.animateOnMount) model.from.toFloat() else model.value.toFloat())
  }
  LaunchedEffect(model.value) {
    if (model.delayMs > 0f) delay(model.delayMs.toLong())
    anim.animateTo(
      targetValue = model.value.toFloat(),
      animationSpec = tween(model.duration.toInt().coerceAtLeast(0), easing = FastOutSlowInEasing)
    )
    model.onEnd?.invoke(model.value)
  }
  val shown = formatNumber(anim.value.toDouble(), model.decimals, model.separator)
  Box(modifier = Modifier.fillMaxSize(), contentAlignment = numberAlignment(model)) {
    Text(
      text = model.prefix + shown + model.suffix,
      style = numberStyle(model),
      maxLines = 1,
      softWrap = false
    )
  }
}

// MARK: - Odometer variant

@Composable
private fun SilkOdometer(model: SilkNumberViewModel) {
  val style = numberStyle(model)
  val measurer = rememberTextMeasurer()
  val density = LocalDensity.current

  // Fixed digit metrics so slots never reflow as digits change.
  val metrics = remember(style) {
    val widths = (0..9).map { measurer.measure(AnnotatedString(it.toString()), style).size.width }
    val h = measurer.measure(AnnotatedString("0"), style).size.height
    widths.max() to h
  }
  val digitW = with(density) { metrics.first.toDp() }
  val digitH = with(density) { metrics.second.toDp() }
  val stiffness = springStiffness(model.duration)

  var displayed by remember { mutableStateOf(if (model.animateOnMount) model.from else model.value) }

  LaunchedEffect(model.value) {
    if (model.delayMs > 0f && displayed == model.from) delay(model.delayMs.toLong())
    displayed = model.value
    delay(model.duration.toLong().coerceAtLeast(0))
    model.onEnd?.invoke(model.value)
  }

  val formatted = model.prefix + formatNumber(displayed, model.decimals, model.separator) + model.suffix

  Box(modifier = Modifier.fillMaxSize(), contentAlignment = numberAlignment(model)) {
    Row(verticalAlignment = Alignment.CenterVertically) {
      formatted.forEach { ch ->
        if (ch.isDigit()) {
          RollingDigit(ch, style, digitW, digitH, metrics.second, stiffness)
        } else {
          Text(ch.toString(), style = style, maxLines = 1, softWrap = false)
        }
      }
    }
  }
}

/**
 * A single digit slot in the odometer wheel.
 *
 * Instead of a 0→1 fraction that must be snapped and restarted on each value
 * change, we animate a continuous *scroll position* in digit-space (0.0..9.0).
 * Compose's [Animatable] preserves the current velocity when [animateTo] is
 * called mid-animation, so a new target during a rapid update continues
 * smoothly from wherever the spring is at that moment — no snap, no restart.
 *
 * Rendering: digit `d` is translated by `(d - scrollPos) * h` pixels.
 *   • scrollPos == d  → digit d is centered (translationY = 0)
 *   • scrollPos > d   → digit d is above center (being scrolled away upward)
 *   • scrollPos < d   → digit d is below center (not yet arrived)
 * Increasing scrollPos scrolls the column upward; decreasing scrolls downward.
 */
@Composable
private fun RollingDigit(
  target: Char,
  style: TextStyle,
  widthDp: Dp,
  heightDp: Dp,
  heightPx: Int,
  stiffness: Float
) {
  val targetInt = target.digitToInt()
  val scrollPos = remember { Animatable(targetInt.toFloat()) }

  LaunchedEffect(target) {
    scrollPos.animateTo(
      targetValue = targetInt.toFloat(),
      animationSpec = spring(
        dampingRatio = 0.9f,
        stiffness = stiffness,
        visibilityThreshold = 0.01f
      )
    )
  }

  val pos = scrollPos.value
  val h = heightPx.toFloat()
  // Two adjacent digit slots currently visible in the column window.
  // Clamp lo to 0..8 so hi = lo+1 always stays in 1..9.
  val lo = pos.toInt().coerceIn(0, 8)
  val hi = lo + 1

  Box(
    modifier = Modifier
      .size(widthDp, heightDp)
      .clipToBounds(),
    contentAlignment = Alignment.Center
  ) {
    listOf(lo, hi).forEach { d ->
      val dy = (d.toFloat() - pos) * h
      val alpha = (1f - abs(d.toFloat() - pos)).coerceIn(0f, 1f)
      if (alpha > 0.01f) {
        Text(
          text = d.toString(),
          style = style,
          maxLines = 1,
          softWrap = false,
          modifier = Modifier.graphicsLayer {
            translationY = dy
            this.alpha = alpha
          }
        )
      }
    }
  }
}

// MARK: - Helpers

private fun springStiffness(durationMs: Float): Float {
  val response = (durationMs / 1000f).coerceAtLeast(0.05f)
  val omega = (2.0 * Math.PI / response)
  return (omega * omega).toFloat().coerceIn(40f, 2000f)
}

private fun numberStyle(model: SilkNumberViewModel): TextStyle = TextStyle(
  color = model.color?.let { Color(it) } ?: Color.Black,
  fontSize = model.fontSize.sp,
  fontWeight = FontWeight(model.fontWeight.coerceIn(1, 1000)),
  fontStyle = if (model.italic) FontStyle.Italic else FontStyle.Normal,
  fontFamily = resolveFontFamily(model.fontFamily)
)

private fun formatNumber(v: Double, decimals: Int, separator: String): String {
  val symbols = DecimalFormatSymbols(Locale.US)
  if (separator.isNotEmpty()) symbols.groupingSeparator = separator[0]
  val pattern = StringBuilder(if (separator.isNotEmpty()) "#,##0" else "0")
  if (decimals > 0) {
    pattern.append('.')
    repeat(decimals) { pattern.append('0') }
  }
  val df = DecimalFormat(pattern.toString(), symbols)
  df.isGroupingUsed = separator.isNotEmpty()
  return df.format(v)
}

private fun numberAlignment(model: SilkNumberViewModel): Alignment = when (model.textAlign) {
  "center" -> Alignment.Center
  "right" -> Alignment.CenterEnd
  else -> Alignment.CenterStart
}
