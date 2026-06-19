package com.silktext

import android.content.Context
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event

/**
 * Fabric host view wrapping the native [SilkText] Compose engine. Props flow in
 * via [SilkTextViewModel]; the animation-complete callback is dispatched back
 * to JS as a bubbling event.
 */
class SilkTextView(context: Context) : SilkComposeHost(context) {

  val model = SilkTextViewModel()

  init {
    setComposeContent { SilkText(model) }
    model.onComplete = { text -> dispatchComplete(text) }
  }

  private fun dispatchComplete(text: String) {
    val reactContext = context as? ReactContext ?: return
    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
    UIManagerHelper
      .getEventDispatcherForReactTag(reactContext, id)
      ?.dispatchEvent(OnAnimationCompleteEvent(surfaceId, id, text))
  }

  class OnAnimationCompleteEvent(
    surfaceId: Int,
    viewId: Int,
    private val text: String
  ) : Event<OnAnimationCompleteEvent>(surfaceId, viewId) {
    override fun getEventName(): String = EVENT_NAME
    override fun getEventData(): WritableMap =
      Arguments.createMap().apply { putString("text", text) }

    companion object {
      const val EVENT_NAME = "onAnimationComplete"
    }
  }
}
