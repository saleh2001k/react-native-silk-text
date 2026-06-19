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
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.util.Locale

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
  var previous by remember { mutableStateOf(displayed) }

  LaunchedEffect(model.value) {
    if (model.delayMs > 0f && displayed == model.from) delay(model.delayMs.toLong())
    previous = displayed
    displayed = model.value
    delay(model.duration.toLong().coerceAtLeast(0))
    model.onEnd?.invoke(model.value)
  }

  val goingUp = displayed >= previous
  val formatted = model.prefix + formatNumber(displayed, model.decimals, model.separator) + model.suffix

  Box(modifier = Modifier.fillMaxSize(), contentAlignment = numberAlignment(model)) {
    Row(verticalAlignment = Alignment.CenterVertically) {
      formatted.forEach { ch ->
        if (ch.isDigit()) {
          RollingDigit(ch, goingUp, style, digitW, digitH, metrics.second, stiffness)
        } else {
          Text(ch.toString(), style = style, maxLines = 1, softWrap = false)
        }
      }
    }
  }
}

@Composable
private fun RollingDigit(
  target: Char,
  goingUp: Boolean,
  style: TextStyle,
  widthDp: androidx.compose.ui.unit.Dp,
  heightDp: androidx.compose.ui.unit.Dp,
  heightPx: Int,
  stiffness: Float
) {
  var current by remember { mutableStateOf(target) }
  var previous by remember { mutableStateOf(target) }
  val anim = remember { Animatable(1f) }

  LaunchedEffect(target) {
    if (target != current) {
      previous = current
      current = target
      anim.snapTo(0f)
      anim.animateTo(1f, spring(dampingRatio = 0.9f, stiffness = stiffness))
    }
  }

  val p = anim.value
  val inc = if (goingUp) -1f else 1f // incoming enters from top when increasing
  val h = heightPx.toFloat()

  Box(
    modifier = Modifier.size(widthDp, heightDp).clipToBounds(),
    contentAlignment = Alignment.Center
  ) {
    if (p < 0.999f) {
      Text(
        text = previous.toString(),
        style = style,
        maxLines = 1,
        softWrap = false,
        modifier = Modifier.graphicsLayer {
          translationY = -inc * h * p
          alpha = (1f - p).coerceIn(0f, 1f)
        }
      )
    }
    Text(
      text = current.toString(),
      style = style,
      maxLines = 1,
      softWrap = false,
      modifier = Modifier.graphicsLayer {
        translationY = inc * h * (1f - p)
        alpha = p.coerceIn(0f, 1f)
      }
    )
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
