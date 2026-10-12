package com.vesper.companion

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.os.Bundle
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

/**
 * VESPER Android Accessibility Service
 * Intercepts focus on editable text areas and injects polished speech dictation.
 */
class VesperAccessibilityService : AccessibilityService() {

    companion object {
        var instance: VesperAccessibilityService? = null
            private set
    }

    private var activeEditableNode: AccessibilityNodeInfo? = null

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        when (event.eventType) {
            AccessibilityEvent.TYPE_VIEW_FOCUSED -> {
                val source = event.source
                if (source != null && source.isEditable) {
                    activeEditableNode = source
                    val packageName = event.packageName?.toString() ?: "Unknown App"
                    
                    // Trigger the floating overlay pill near the keyboard/active field
                    FloatingPillOverlayService.show(this, packageName)
                }
            }
            AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED -> {
                // Track text state changes if needed
            }
        }
    }

    override fun onInterrupt() {
        instance = null
        activeEditableNode = null
    }

    override fun onDestroy() {
        super.onDestroy()
        instance = null
        activeEditableNode = null
    }

    /**
     * Injects polished dictation text into the currently focused editable input field.
     */
    fun injectPolishedText(text: String): Boolean {
        val targetNode = activeEditableNode ?: rootInActiveWindow?.findFocus(AccessibilityNodeInfo.FOCUS_INPUT)
        if (targetNode != null && targetNode.isEditable) {
            val arguments = Bundle().apply {
                putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, text)
            }
            return targetNode.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, arguments)
        }
        return false
    }
}
