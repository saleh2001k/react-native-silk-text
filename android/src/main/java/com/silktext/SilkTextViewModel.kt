package com.silktext

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

/**
 * Compose-observable state holder bridged from React props. Mutating any field
 * triggers recomposition of [SilkText]; mutating [text] restarts the per-letter
 * animation.
 */
class SilkTextViewModel {
  var text by mutableStateOf("")
  var fontFamily by mutableStateOf("")
  var fontSize by mutableStateOf(17f)
  var fontWeight by mutableStateOf(400)
  var italic by mutableStateOf(false)
  var color by mutableStateOf<Int?>(null)
  var textAlign by mutableStateOf("auto")
  var letterSpacing by mutableStateOf(0f)
  var lineHeight by mutableStateOf(0f)
  var numberOfLines by mutableStateOf(0)
  var adjustsFontSizeToFit by mutableStateOf(false)
  var minimumFontScale by mutableStateOf(0.5f)
  var ellipsizeMode by mutableStateOf("tail")
  var textTransform by mutableStateOf("none")
  var writingDirection by mutableStateOf("auto")
  var animationType by mutableStateOf("slide")
  var duration by mutableStateOf(500f) // milliseconds
  var stagger by mutableStateOf(0.05f) // seconds
  var unit by mutableStateOf("letters")
  var animationEnabled by mutableStateOf(true)

  var onComplete: ((String) -> Unit)? = null
}
