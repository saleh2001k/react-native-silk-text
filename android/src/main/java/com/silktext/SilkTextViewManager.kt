package com.silktext

import com.facebook.react.common.MapBuilder
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

  private val mDelegate: ViewManagerDelegate<SilkTextView> =
    SilkTextViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<SilkTextView> = mDelegate

  override fun getName(): String = NAME

  public override fun createViewInstance(context: ThemedReactContext): SilkTextView =
    SilkTextView(context)

  override fun getExportedCustomBubblingEventTypeConstants(): MutableMap<String, Any> =
    mutableMapOf(
      SilkTextView.OnAnimationCompleteEvent.EVENT_NAME to MapBuilder.of<String, Any>(
        "phasedRegistrationNames",
        MapBuilder.of<String, String>(
          "bubbled", "onAnimationComplete",
          "captured", "onAnimationCompleteCapture"
        )
      )
    )

  @ReactProp(name = "text")
  override fun setText(view: SilkTextView, value: String?) {
    view.model.text = value ?: ""
  }

  @ReactProp(name = "color", customType = "Color")
  override fun setColor(view: SilkTextView, value: Int?) {
    view.model.color = value
  }

  @ReactProp(name = "fontFamily")
  override fun setFontFamily(view: SilkTextView, value: String?) {
    view.model.fontFamily = value ?: ""
  }

  @ReactProp(name = "fontSize")
  override fun setFontSize(view: SilkTextView, value: Double) {
    view.model.fontSize = value.toFloat()
  }

  @ReactProp(name = "fontWeight")
  override fun setFontWeight(view: SilkTextView, value: String?) {
    view.model.fontWeight = weightToInt(value)
  }

  @ReactProp(name = "fontStyle")
  override fun setFontStyle(view: SilkTextView, value: String?) {
    view.model.italic = value == "italic"
  }

  @ReactProp(name = "textAlign")
  override fun setTextAlign(view: SilkTextView, value: String?) {
    view.model.textAlign = value ?: "auto"
  }

  @ReactProp(name = "letterSpacing")
  override fun setLetterSpacing(view: SilkTextView, value: Double) {
    view.model.letterSpacing = value.toFloat()
  }

  @ReactProp(name = "lineHeight")
  override fun setLineHeight(view: SilkTextView, value: Double) {
    view.model.lineHeight = value.toFloat()
  }

  @ReactProp(name = "numberOfLines")
  override fun setNumberOfLines(view: SilkTextView, value: Int) {
    view.model.numberOfLines = value
  }

  @ReactProp(name = "adjustsFontSizeToFit")
  override fun setAdjustsFontSizeToFit(view: SilkTextView, value: Boolean) {
    view.model.adjustsFontSizeToFit = value
  }

  @ReactProp(name = "minimumFontScale")
  override fun setMinimumFontScale(view: SilkTextView, value: Double) {
    view.model.minimumFontScale = value.toFloat()
  }

  @ReactProp(name = "ellipsizeMode")
  override fun setEllipsizeMode(view: SilkTextView, value: String?) {
    view.model.ellipsizeMode = value ?: "tail"
  }

  @ReactProp(name = "textTransform")
  override fun setTextTransform(view: SilkTextView, value: String?) {
    view.model.textTransform = value ?: "none"
  }

  @ReactProp(name = "writingDirection")
  override fun setWritingDirection(view: SilkTextView, value: String?) {
    view.model.writingDirection = value ?: "auto"
  }

  @ReactProp(name = "allowFontScaling")
  override fun setAllowFontScaling(view: SilkTextView, value: Boolean) {
    // Compose honours the system font scale by default; nothing to toggle.
  }

  @ReactProp(name = "animationType")
  override fun setAnimationType(view: SilkTextView, value: String?) {
    view.model.animationType = value ?: "slide"
  }

  @ReactProp(name = "animationDuration")
  override fun setAnimationDuration(view: SilkTextView, value: Double) {
    view.model.duration = value.toFloat()
  }

  @ReactProp(name = "animationStagger")
  override fun setAnimationStagger(view: SilkTextView, value: Double) {
    view.model.stagger = value.toFloat()
  }

  @ReactProp(name = "unit")
  override fun setUnit(view: SilkTextView, value: String?) {
    view.model.unit = value ?: "letters"
  }

  @ReactProp(name = "animationEnabled")
  override fun setAnimationEnabled(view: SilkTextView, value: Boolean) {
    view.model.animationEnabled = value
  }

  private fun weightToInt(value: String?): Int = when (value) {
    null, "normal" -> 400
    "bold" -> 700
    else -> value.toIntOrNull() ?: 400
  }

  companion object {
    const val NAME = "SilkTextView"
  }
}
