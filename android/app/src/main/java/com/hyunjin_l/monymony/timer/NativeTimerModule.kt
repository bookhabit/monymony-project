package com.hyunjin_l.monymony.timer

import android.content.Intent
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.nativelocalstorage.NativeTimerModuleSpec

class NativeTimerModule(reactContext: ReactApplicationContext) : NativeTimerModuleSpec(reactContext) {

  init {
    // TimerService에 ReactContext 설정
    TimerService.setReactContext(reactContext)
  }


  @ReactMethod
  override fun startTimer(seconds: Double) {
    val intent = Intent(getReactApplicationContext(), TimerService::class.java).apply {
      action = TimerService.ACTION_START
      putExtra(TimerService.EXTRA_TOTAL_SECONDS, seconds.toInt())
    }
    
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      getReactApplicationContext().startForegroundService(intent)
    } else {
      getReactApplicationContext().startService(intent)
    }
  }

  @ReactMethod
  override fun pauseTimer() {
    val intent = Intent(getReactApplicationContext(), TimerService::class.java).apply {
      action = TimerService.ACTION_PAUSE
    }
    getReactApplicationContext().startService(intent)
  }

  @ReactMethod
  override fun resumeTimer() {
    val intent = Intent(getReactApplicationContext(), TimerService::class.java).apply {
      action = TimerService.ACTION_RESUME
    }
    getReactApplicationContext().startService(intent)
  }

  @ReactMethod
  override fun stopTimer() {
    val intent = Intent(getReactApplicationContext(), TimerService::class.java).apply {
      action = TimerService.ACTION_STOP
    }
    getReactApplicationContext().stopService(intent)
  }

  @ReactMethod
  override fun getRemainingSeconds(promise: Promise) {
    val remaining = TimerService.getRemainingSeconds()
    promise.resolve(remaining.toDouble())
  }

  @ReactMethod
  override fun isRunning(promise: Promise) {
    promise.resolve(TimerService.isRunning())
  }

  @ReactMethod
  override fun isPaused(promise: Promise) {
    promise.resolve(TimerService.isPaused())
  }

  @ReactMethod
  override fun isAlarming(promise: Promise) {
    promise.resolve(TimerService.isAlarming())
  }

  @ReactMethod
  override fun addListener(eventName: String) {
    // 이벤트 리스너는 자동으로 등록됨
  }

  @ReactMethod
  override fun removeListeners(count: Double) {
    // 이벤트 리스너 제거는 자동으로 처리됨
  }

  private fun sendEvent(eventName: String, params: WritableMap?) {
    getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  companion object {
    const val NAME = "NativeTimerModule"
    
    @JvmStatic
    fun sendTimerUpdate(reactContext: ReactApplicationContext, remainingSeconds: Int, isRunning: Boolean, isPaused: Boolean) {
      val params = Arguments.createMap().apply {
        putInt("remainingSeconds", remainingSeconds)
        putBoolean("isRunning", isRunning)
        putBoolean("isPaused", isPaused)
      }
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("onTimerUpdate", params)
    }
    
    @JvmStatic
    fun sendTimerFinished(reactContext: ReactApplicationContext) {
      val params = Arguments.createMap()
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("onTimerFinished", params)
    }
  }
}

