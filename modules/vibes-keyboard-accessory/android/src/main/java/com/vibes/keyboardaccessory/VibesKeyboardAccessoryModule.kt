package com.vibes.keyboardaccessory

import android.app.Activity
import android.content.Context
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.ImageButton
import android.widget.ImageView
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.math.max

class VibesKeyboardAccessoryModule : Module() {
  private var controller: VibesKeyboardAccessoryController? = null

  override fun definition() = ModuleDefinition {
    Name("VibesKeyboardAccessory")

    Function("setEnabled") { enabled: Boolean ->
      val activity = appContext.currentActivity
      activity?.runOnUiThread {
        if (enabled) {
          ensureController(activity).setEnabled(true)
        } else {
          controller?.setEnabled(false)
        }
      }
    }

    OnDestroy {
      controller?.activity?.runOnUiThread {
        controller?.dispose()
        controller = null
      }
    }
  }

  private fun ensureController(activity: Activity): VibesKeyboardAccessoryController {
    val existing = controller
    if (existing != null && existing.activity === activity) {
      return existing
    }

    existing?.dispose()
    return VibesKeyboardAccessoryController(activity).also {
      controller = it
    }
  }
}

private class VibesKeyboardAccessoryController(val activity: Activity) {
  private var isEnabled = false
  private var container: FrameLayout? = null
  private var button: ImageButton? = null
  private var currentInput: EditText? = null
  private var latestInsets: WindowInsetsCompat? = null
  private var isHiddenForCurrentFocus = false
  private val decorView: View
    get() = activity.window.decorView
  private val decorGroup: ViewGroup?
    get() = activity.window.decorView as? ViewGroup

  private val focusListener = ViewTreeObserver.OnGlobalFocusChangeListener { _, newFocus ->
    if (newFocus is EditText) {
      currentInput = newFocus
      isHiddenForCurrentFocus = false
    } else if (newFocus == null) {
      currentInput = null
      isHiddenForCurrentFocus = false
    }

    updateVisibility()
  }

  fun setEnabled(enabled: Boolean) {
    if (isEnabled == enabled) {
      return
    }

    isEnabled = enabled

    if (enabled) {
      install()
    } else {
      uninstall()
    }
  }

  fun dispose() {
    uninstall()
  }

  private fun install() {
    if (container != null) {
      updateVisibility()
      return
    }

    val group = decorGroup ?: return
    val nextContainer = FrameLayout(activity)
    nextContainer.isClickable = false
    nextContainer.clipChildren = false
    nextContainer.clipToPadding = false

    val nextButton = ImageButton(activity)
    nextButton.scaleType = ImageView.ScaleType.CENTER
    nextButton.setImageResource(R.drawable.vibes_keyboard_accessory_chevron_down)
    nextButton.setColorFilter(Color.rgb(17, 17, 17))
    nextButton.contentDescription = "Hide keyboard accessory"
    nextButton.background = GradientDrawable().apply {
      shape = GradientDrawable.RECTANGLE
      cornerRadius = dp(18).toFloat()
      setColor(Color.rgb(111, 232, 168))
    }
    nextButton.elevation = dp(8).toFloat()
    nextButton.setOnClickListener {
      hideKeyboardForCurrentFocus()
    }

    nextContainer.addView(
      nextButton,
      FrameLayout.LayoutParams(dp(48), dp(36), Gravity.BOTTOM or Gravity.END).apply {
        marginEnd = dp(16)
        bottomMargin = dp(10)
      }
    )

    group.addView(
      nextContainer,
      ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
    )

    container = nextContainer
    button = nextButton
    currentInput = activity.currentFocus as? EditText
    decorView.viewTreeObserver.addOnGlobalFocusChangeListener(focusListener)

    ViewCompat.setOnApplyWindowInsetsListener(nextContainer) { _, insets ->
      latestInsets = insets
      updatePosition()
      updateVisibility()
      insets
    }

    ViewCompat.setWindowInsetsAnimationCallback(
      nextContainer,
      object : WindowInsetsAnimationCompat.Callback(WindowInsetsAnimationCompat.Callback.DISPATCH_MODE_CONTINUE_ON_SUBTREE) {
        override fun onProgress(
          insets: WindowInsetsCompat,
          runningAnimations: MutableList<WindowInsetsAnimationCompat>
        ): WindowInsetsCompat {
          latestInsets = insets
          updatePosition()
          updateVisibility()
          return insets
        }
      }
    )

    ViewCompat.requestApplyInsets(nextContainer)
    updatePosition()
    updateVisibility()
  }

  private fun uninstall() {
    if (decorView.viewTreeObserver.isAlive) {
      decorView.viewTreeObserver.removeOnGlobalFocusChangeListener(focusListener)
    }

    container?.let {
      ViewCompat.setOnApplyWindowInsetsListener(it, null)
      ViewCompat.setWindowInsetsAnimationCallback(it, null)
      decorGroup?.removeView(it)
    }

    container = null
    button = null
    currentInput = null
    latestInsets = null
    isHiddenForCurrentFocus = false
  }

  private fun updatePosition() {
    val insets = latestInsets
    val imeBottom = insets?.getInsets(WindowInsetsCompat.Type.ime())?.bottom ?: 0
    val navigationBottom = insets?.getInsets(WindowInsetsCompat.Type.navigationBars())?.bottom ?: 0
    val offset = max(0, imeBottom - navigationBottom)

    button?.translationY = -offset.toFloat()
    val layoutParams = button?.layoutParams as? FrameLayout.LayoutParams
    layoutParams?.bottomMargin = dp(10) + navigationBottom
    button?.layoutParams = layoutParams
  }

  private fun updateVisibility() {
    val insets = latestInsets
    val hasFocusedInput = currentInput?.hasFocus() == true
    val isImeVisible = insets?.isVisible(WindowInsetsCompat.Type.ime()) == true
    val shouldShow = isEnabled && hasFocusedInput && isImeVisible && !isHiddenForCurrentFocus

    button?.visibility = if (shouldShow) View.VISIBLE else View.GONE
  }

  private fun hideKeyboardForCurrentFocus() {
    val input = currentInput ?: activity.currentFocus as? EditText ?: return
    val inputMethodManager = activity.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager

    isHiddenForCurrentFocus = true
    updateVisibility()
    inputMethodManager.hideSoftInputFromWindow(input.windowToken, 0)
    input.clearFocus()
  }

  private fun dp(value: Int): Int {
    return (value * activity.resources.displayMetrics.density).toInt()
  }
}
