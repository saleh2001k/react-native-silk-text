package com.silktext

import android.content.Context
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event

/** Fabric host view wrapping the [SilkNumber] counter composable. */
class SilkNumberView(context: Context) : SilkComposeHost(context) {

  val model = SilkNumberViewModel()

  init {
    setComposeContent { SilkNumber(model) }
    model.onEnd = { value -> dispatchEnd(value) }
  }

  private fun dispatchEnd(value: Double) {
    val reactContext = context as? ReactContext ?: return
    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
    UIManagerHelper
      .getEventDispatcherForReactTag(reactContext, id)
      ?.dispatchEvent(OnCounterEndEvent(surfaceId, id, value))
  }

  class OnCounterEndEvent(
    surfaceId: Int,
    viewId: Int,
    private val value: Double
  ) : Event<OnCounterEndEvent>(surfaceId, viewId) {
    override fun getEventName(): String = EVENT_NAME
    override fun getEventData(): WritableMap =
      Arguments.createMap().apply { putDouble("value", value) }

    companion object {
      const val EVENT_NAME = "onCounterEnd"
    }
  }
}
