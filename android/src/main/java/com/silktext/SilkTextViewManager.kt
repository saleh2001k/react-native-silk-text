package com.silktext

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.SilkTextViewManagerInterface
import com.facebook.react.viewmanagers.SilkTextViewManagerDelegate

@ReactModule(name = SilkTextViewManager.NAME)
class SilkTextViewManager : SimpleViewManager<SilkTextView>(),
  SilkTextViewManagerInterface<SilkTextView> {
  private val mDelegate: ViewManagerDelegate<SilkTextView>

  init {
    mDelegate = SilkTextViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<SilkTextView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): SilkTextView {
    return SilkTextView(context)
  }

  @ReactProp(name = "color")
  override fun setColor(view: SilkTextView?, color: Int?) {
    view?.setBackgroundColor(color ?: Color.TRANSPARENT)
  }

  companion object {
    const val NAME = "SilkTextView"
  }
}
