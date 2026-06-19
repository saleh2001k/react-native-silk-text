package com.silktext

import android.content.Context
import android.view.View
import android.view.View.MeasureSpec
import android.widget.FrameLayout
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.ViewCompositionStrategy

/**
 * Hosts Jetpack Compose inside a Fabric-managed [FrameLayout].
 *
 * Root problem: Fabric calls [onMeasure] on native views *before* inserting
 * them into the window hierarchy. [ComposeView.onMeasure] calls
 * ensureCompositionCreated → resolveParentCompositionContext, which crashes
 * with "Cannot locate windowRecomposer" when the view is not window-attached.
 *
 * Fix:
 * 1. [onMeasure] — when not attached, return Fabric's exact spec size without
 *    measuring children. This prevents the crash. [composeView] will have zero
 *    measured dimensions at this stage.
 *
 * 2. [onLayout] — always fill [composeView] to our own layout bounds, ignoring
 *    its measured size. Fabric drives layout via Yoga; by the time [onLayout]
 *    is called our bounds are correct, so [composeView] gets the right rect
 *    even though it was never properly measured.
 *
 * 3. [setComposeContent] / [applyContentIfNeeded] — defer [ComposeView.setContent]
 *    until [composeView] is window-attached. After calling setContent, post a
 *    manual measure+layout so Compose immediately knows its constraints, rather
 *    than waiting for a full ViewRootImpl traversal (which Fabric may suppress).
 */
open class SilkComposeHost(context: Context) : FrameLayout(context) {

  private val composeView = ComposeView(context)
  private var composeContent: (@Composable () -> Unit)? = null

  init {
    composeView.setViewCompositionStrategy(
      ViewCompositionStrategy.DisposeOnDetachedFromWindow
    )
    composeView.addOnAttachStateChangeListener(
      object : View.OnAttachStateChangeListener {
        override fun onViewAttachedToWindow(v: View) {
          applyContentIfNeeded()
        }

        override fun onViewDetachedFromWindow(v: View) {
          // Composition is disposed automatically by DisposeOnDetachedFromWindow.
        }
      }
    )
    addView(
      composeView,
      LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    )
  }

  fun setComposeContent(content: @Composable () -> Unit) {
    composeContent = content
    applyContentIfNeeded()
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    applyContentIfNeeded()
  }

  /**
   * Fabric measures views before window-attach. [ComposeView.onMeasure] crashes
   * in that state, so we skip child measurement and report the exact Fabric spec.
   * Once attached, delegate to [FrameLayout] so Compose is measured normally.
   */
  override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
    if (!isAttachedToWindow) {
      setMeasuredDimension(
        MeasureSpec.getSize(widthMeasureSpec),
        MeasureSpec.getSize(heightMeasureSpec)
      )
      return
    }
    super.onMeasure(widthMeasureSpec, heightMeasureSpec)
  }

  /**
   * Always stretch [composeView] to fill our layout bounds. This is necessary
   * because [composeView] may have zero measured dimensions (we skipped child
   * measurement in [onMeasure] while not attached), yet our own bounds are
   * correct (Fabric's Yoga layout drives them directly via [layout]).
   */
  override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
    composeView.layout(0, 0, r - l, b - t)
  }

  private fun applyContentIfNeeded() {
    val content = composeContent ?: return
    if (!composeView.isAttachedToWindow) return
    composeView.setContent(content)
    // Post a manual measure+layout so Compose gets the correct constraints on
    // the very next frame. This is a safety net for cases where Fabric suppresses
    // the normal ViewRootImpl re-traversal triggered by ComposeView.requestLayout().
    post { remeasureComposeView() }
  }

  private fun remeasureComposeView() {
    if (!composeView.isAttachedToWindow) return
    val w = width
    val h = height
    composeView.measure(
      MeasureSpec.makeMeasureSpec(w, MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(h, MeasureSpec.EXACTLY)
    )
    composeView.layout(0, 0, w, h)
    composeView.invalidate()
  }
}
