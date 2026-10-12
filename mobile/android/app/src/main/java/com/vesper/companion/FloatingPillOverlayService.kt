package com.vesper.companion

import android.annotation.SuppressLint
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.os.IBinder
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.TextView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream

/**
 * Floating Pill Overlay Service
 * Renders an unobtrusive capsule overlay pill over active Android applications.
 * Supports Tap-to-Record and Hold-to-Talk gestures with instant text injection.
 */
class FloatingPillOverlayService : Service() {

    companion object {
        const val ACTION_SHOW = "com.vesper.ACTION_SHOW"
        const val ACTION_HIDE = "com.vesper.ACTION_HIDE"
        const val EXTRA_APP_NAME = "extra_app_name"

        fun show(context: Context, appName: String) {
            val intent = Intent(context, FloatingPillOverlayService::class.java).apply {
                action = ACTION_SHOW
                putExtra(EXTRA_APP_NAME, appName)
            }
            context.startService(intent)
        }

        fun hide(context: Context) {
            val intent = Intent(context, FloatingPillOverlayService::class.java).apply {
                action = ACTION_HIDE
            }
            context.startService(intent)
        }
    }

    private var windowManager: WindowManager? = null
    private var overlayView: View? = null
    private var isRecording = false
    private var audioRecord: AudioRecord? = null
    private val recordingScope = CoroutineScope(Dispatchers.IO)
    private var audioBufferStream = ByteArrayOutputStream()

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_SHOW -> {
                val appName = intent.getStringExtra(EXTRA_APP_NAME) ?: "Input"
                showOverlayPill(appName)
            }
            ACTION_HIDE -> hideOverlayPill()
        }
        return START_NOT_STICKY
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun showOverlayPill(appName: String) {
        if (overlayView != null) return

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.BOTTOM or Gravity.END
            x = 32
            y = 180
        }

        val frame = FrameLayout(this).apply {
            setBackgroundColor(0xEE0A0C10.toInt())
            setPadding(28, 18, 28, 18)
        }

        // Tap or Hold Gesture Logic
        var touchDownTime = 0L
        frame.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    touchDownTime = System.currentTimeMillis()
                    startRecording()
                    true
                }
                MotionEvent.ACTION_UP -> {
                    val duration = System.currentTimeMillis() - touchDownTime
                    if (duration > 350) {
                        // Hold-to-Talk release
                        stopRecordingAndInject()
                    } else {
                        // Short tap toggle
                        if (!isRecording) startRecording() else stopRecordingAndInject()
                    }
                    true
                }
                else -> false
            }
        }

        overlayView = frame
        windowManager?.addView(overlayView, params)
    }

    private fun hideOverlayPill() {
        overlayView?.let {
            windowManager?.removeView(it)
            overlayView = null
        }
    }

    @SuppressLint("MissingPermission")
    private fun startRecording() {
        if (isRecording) return
        isRecording = true
        audioBufferStream.reset()

        val sampleRate = 16000
        val bufferSize = AudioRecord.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT
        )

        audioRecord = AudioRecord(
            MediaRecorder.AudioSource.MIC,
            sampleRate,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT,
            bufferSize
        )

        audioRecord?.startRecording()

        recordingScope.launch {
            val buffer = ByteArray(1024)
            while (isRecording && audioRecord != null) {
                val read = audioRecord?.read(buffer, 0, buffer.size) ?: 0
                if (read > 0) {
                    audioBufferStream.write(buffer, 0, read)
                }
            }
        }
    }

    private fun stopRecordingAndInject() {
        if (!isRecording) return
        isRecording = false
        audioRecord?.stop()
        audioRecord?.release()
        audioRecord = null

        val pcmData = audioBufferStream.toByteArray()

        recordingScope.launch {
            val transcript = SpeechTranscriptionEngine.transcribeAndPolish(pcmData)
            withContext(Dispatchers.Main) {
                if (transcript.isNotEmpty()) {
                    VesperAccessibilityService.instance?.injectPolishedText(transcript)
                }
                hideOverlayPill()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        hideOverlayPill()
        audioRecord?.release()
    }
}
