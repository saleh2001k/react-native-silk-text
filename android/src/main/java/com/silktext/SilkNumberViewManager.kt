package com.silktext

import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.SilkNumberViewManagerInterface
import com.facebook.react.viewmanagers.SilkNumberViewManagerDelegate

@ReactModule(name = SilkNumberViewManager.NAME)
class SilkNumberViewManager : SimpleViewManager<SilkNumberView>(),
  SilkNumberViewManagerInterface<SilkNumberView> {

  private val mDelegate: ViewManagerDelegate<SilkNumberView> =
    SilkNumberViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<SilkNumberView> = mDelegate
  override fun getName(): String = NAME

  public override fun createViewInstance(context: ThemedReactContext): SilkNumberView =
    SilkNumberView(context)

  override fun getExportedCustomBubblingEventTypeConstants(): MutableMap<String, Any> =
    mutableMapOf(
      SilkNumberView.OnCounterEndEvent.EVENT_NAME to MapBuilder.of<String, Any>(
        "phasedRegistrationNames",
        MapBuilder.of<String, String>(
          "bubbled", "onCounterEnd",
          "captured", "onCounterEndCapture"
        )
      )
    )

  @ReactProp(name = "value")
  override fun setValue(view: SilkNumberView, value: Double) {
    view.model.value = value
  }

  @ReactProp(name = "from")
  override fun setFrom(view: SilkNumberView, value: Double) {
    view.model.from = value
  }

  @ReactProp(name = "duration")
  override fun setDuration(view: SilkNumberView, value: Double) {
    view.model.duration = value.toFloat()
  }

  @ReactProp(name = "delay")
  override fun setDelay(view: SilkNumberView, value: Double) {
    view.model.delayMs = value.toFloat()
  }

  @ReactProp(name = "decimals")
  override fun setDecimals(view: SilkNumberView, value: Int) {
    view.model.decimals = value
  }

  @ReactProp(name = "separator")
  override fun setSeparator(view: SilkNumberView, value: String?) {
    view.model.separator = value ?: ""
  }

  @ReactProp(name = "prefix")
  override fun setPrefix(view: SilkNumberView, value: String?) {
    view.model.prefix = value ?: ""
  }

  @ReactProp(name = "suffix")
  override fun setSuffix(view: SilkNumberView, value: String?) {
    view.model.suffix = value ?: ""
  }

  @ReactProp(name = "animateOnMount")
  override fun setAnimateOnMount(view: SilkNumberView, value: Boolean) {
    view.model.animateOnMount = value
  }

  @ReactProp(name = "variant")
  override fun setVariant(view: SilkNumberView, value: String?) {
    view.model.variant = value ?: "roll"
  }

  @ReactProp(name = "color", customType = "Color")
  override fun setColor(view: SilkNumberView, value: Int?) {
    view.model.color = value
  }

  @ReactProp(name = "fontFamily")
  override fun setFontFamily(view: SilkNumberView, value: String?) {
    view.model.fontFamily = value ?: ""
  }

  @ReactProp(name = "fontSize")
  override fun setFontSize(view: SilkNumberView, value: Double) {
    view.model.fontSize = value.toFloat()
  }

  @ReactProp(name = "fontWeight")
  override fun setFontWeight(view: SilkNumberView, value: String?) {
    view.model.fontWeight = when (value) {
      null, "normal" -> 400
      "bold" -> 700
      else -> value.toIntOrNull() ?: 700
    }
  }

  @ReactProp(name = "fontStyle")
  override fun setFontStyle(view: SilkNumberView, value: String?) {
    view.model.italic = value == "italic"
  }

  @ReactProp(name = "letterSpacing")
  override fun setLetterSpacing(view: SilkNumberView, value: Double) {
    // Not applied to the counter; present for prop parity.
  }

  @ReactProp(name = "textAlign")
  override fun setTextAlign(view: SilkNumberView, value: String?) {
    view.model.textAlign = value ?: "auto"
  }

  companion object {
    const val NAME = "SilkNumberView"
  }
}
