package com.silktext

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

/** Compose-observable state for the animated counter. */
class SilkNumberViewModel {
  var value by mutableStateOf(0.0)
  var from by mutableStateOf(0.0)
  var duration by mutableStateOf(2000f) // ms
  var delayMs by mutableStateOf(0f)
  var decimals by mutableStateOf(0)
  var separator by mutableStateOf("")
  var prefix by mutableStateOf("")
  var suffix by mutableStateOf("")
  var animateOnMount by mutableStateOf(true)
  var variant by mutableStateOf("roll")
  var fontFamily by mutableStateOf("")
  var fontSize by mutableStateOf(34f)
  var fontWeight by mutableStateOf(700)
  var italic by mutableStateOf(false)
  var color by mutableStateOf<Int?>(null)
  var textAlign by mutableStateOf("auto")

  var onEnd: ((Double) -> Unit)? = null
}
