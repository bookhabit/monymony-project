package com.hyunjin_l.monymony.timer

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.nativelocalstorage.NativeTimerModuleSpec

class NativeTimerPackage : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
    if (name == NativeTimerModuleSpec.NAME) {
      NativeTimerModule(reactContext)
    } else {
      null
    }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      NativeTimerModuleSpec.NAME to ReactModuleInfo(
        name = NativeTimerModuleSpec.NAME,
        className = NativeTimerModuleSpec.NAME,
        canOverrideExistingModule = false,
        needsEagerInit = false,
        isCxxModule = false,
        isTurboModule = true
      )
    )
  }
}

