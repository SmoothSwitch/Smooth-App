package com.smoothswitch

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import mobile.Mobile

class SmoothSwitchModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SmoothSwitchEngine"
    }

    @ReactMethod
    fun triggerSwitch(simType: String, iccid: String, promise: Promise) {
        try {
            val result = Mobile.executeMobileSwitch(simType, iccid)
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("SWITCH_ERROR", e.message)
        }
    }
}
