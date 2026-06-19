package com.silktext

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.spring
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.Placeable
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay

/**
 * Native per-letter text engine. Text is split into atomic word groups, fitted
 * / truncated up front with a [androidx.compose.ui.text.TextMeasurer], then
 * flowed through [SilkFlowLayout] so it wraps like real text. Each cell
 * self-animates a flip-up reveal (rotateX + fade) with an index-staggered
 * spring.
 */
@Composable
fun SilkText(model: SilkTextViewModel) {
  val display = transform(model.text, model.textTransform)
  val baseStyle = buildTextStyle(model)
  val measurer = rememberTextMeasurer()
  val density = LocalDensity.current

  CompositionLocalProvider(LocalLayoutDirection provides layoutDirectionOf(model)) {
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
        if (!model.animationEnabled) {
          model.onComplete?.invoke(model.text)
          return@LaunchedEffect
        }
        val cells = groups.sumOf { it.cells.size }
        val total = model.duration / 1000.0 + (cells - 1).coerceAtLeast(0) * model.stagger
        delay((total * 1000).toLong())
        model.onComplete?.invoke(model.text)
      }

      SilkFlowLayout(
        modifier = Modifier.fillMaxWidth(),
        hSpacing = spacePx,
        vSpacing = linePx,
        align = flowAlign(model)
      ) {
        groups.forEach { group ->
          Row {
            group.cells.forEachIndexed { ci, cell ->
              SilkCell(text = cell, index = group.start + ci, model = model, style = style)
            }
          }
        }
      }
    }
  }
}

@Composable
private fun SilkCell(text: String, index: Int, model: SilkTextViewModel, style: TextStyle) {
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
    anim.animateTo(1f, spring(dampingRatio = 0.72f, stiffness = stiffnessFor(model.duration)))
  }

  val v = anim.value
  Text(
    text = text,
    style = style,
    softWrap = false,
    maxLines = 1,
    // Flip-up reveal: each glyph rotates in around its baseline.
    modifier = Modifier.graphicsLayer {
      alpha = v
      rotationX = (1f - v) * -82f
      transformOrigin = TransformOrigin(0.5f, 1f)
      cameraDistance = 12f * density
    }
  )
}

/**
 * Word-atomic wrapping layout. Each child is packed greedily into lines within
 * the incoming width; [Placeable.PlacementScope.placeRelative] mirrors RTL.
 */
@Composable
private fun SilkFlowLayout(
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
