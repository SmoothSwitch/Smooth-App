package com.smoothswitch.app;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import com.smoothswitch.nie.Mobile;

/**
 * Example Android integration for the SmoothSwitch NIE Go engine.
 *
 * This shows how to:
 *   1. Start the engine from an Android Service
 *   2. Submit real telemetry data from Android's TelephonyManager
 *   3. Handle switch decisions
 *   4. Autostart on boot via BroadcastReceiver
 */
public class NIEForegroundService extends Service {

    private static final String TAG = "SmoothSwitch";

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "NIE Service created");

        // ── Start the Go engine (10-second polling) ──────────────────────
        String result = Mobile.startEngine(10);
        Log.d(TAG, "Engine started: " + result);

        // ── Check health ─────────────────────────────────────────────────
        String health = Mobile.healthCheck();
        Log.d(TAG, "Health: " + health);

        // ── Set the active carrier ───────────────────────────────────────
        Mobile.setActiveCarrier("MTN");
    }

    /**
     * Called periodically by your signal monitoring code.
     * Feed real telemetry from TelephonyManager / ConnectivityManager.
     */
    public void onTelemetryAvailable(String carrier,
                                      double signal, double speed,
                                      double latency, double cost,
                                      double variance, double rsrp,
                                      boolean isCallActive) {

        String result = Mobile.submitCarrierTelemetry(
            carrier, signal, speed, latency, cost, variance, rsrp, isCallActive
        );

        Log.d(TAG, "Telemetry result for " + carrier + ": " + result);
        // Parse result JSON → check decision.should_switch → trigger SIM switch
    }

    /**
     * Call this after a successful SIM switch to reset anti-flap timers.
     */
    public void onSwitchCompleted() {
        Mobile.recordSwitchComplete();
    }

    @Override
    public void onDestroy() {
        String result = Mobile.stopEngine();
        Log.d(TAG, "Engine stopped: " + result);
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    // ─────────────────────────────────────────────────────────────────────
    // Phase 5: Autostart on Boot
    // ─────────────────────────────────────────────────────────────────────

    /**
     * BroadcastReceiver to start the NIE service on device boot.
     *
     * AndroidManifest.xml must include:
     * <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
     * <receiver android:name=".BootReceiver" android:exported="true">
     *     <intent-filter>
     *         <action android:name="android.intent.action.BOOT_COMPLETED" />
     *     </intent-filter>
     * </receiver>
     */
    public static class BootReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
                Log.d(TAG, "Boot completed. Starting NIE Foreground Service...");
                Intent serviceIntent = new Intent(context, NIEForegroundService.class);
                context.startForegroundService(serviceIntent);
            }
        }
    }
}
