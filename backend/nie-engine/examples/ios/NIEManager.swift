import Foundation
import SmoothSwitch  // The gomobile-generated xcframework

/**
 Example iOS integration for the SmoothSwitch NIE Go engine.

 This shows how to:
   1. Start/stop the engine from an iOS app
   2. Submit telemetry from CoreTelephony
   3. Handle switch decisions
   4. Register BGTaskScheduler for background execution
*/
class NIEManager {

    static let shared = NIEManager()

    private init() {}

    // MARK: - Engine Lifecycle

    func start(pollInterval: Int = 10) {
        let result = MobileStartEngine(pollInterval)
        print("[SmoothSwitch] Engine started: \(result)")

        // Set the active carrier from CoreTelephony
        MobileSetActiveCarrier("MTN")

        let health = MobileHealthCheck()
        print("[SmoothSwitch] Health: \(health)")
    }

    func stop() {
        let result = MobileStopEngine()
        print("[SmoothSwitch] Engine stopped: \(result)")
    }

    var isRunning: Bool {
        return MobileIsEngineRunning()
    }

    // MARK: - Telemetry

    func submitTelemetry(carrier: String,
                         signal: Double, speed: Double,
                         latency: Double, cost: Double,
                         variance: Double, rsrp: Double,
                         isCallActive: Bool) -> String {

        let result = MobileSubmitCarrierTelemetry(
            carrier, signal, speed, latency, cost, variance, rsrp, isCallActive
        )
        print("[SmoothSwitch] Telemetry for \(carrier): \(result)")
        return result
    }

    func recordSwitchComplete() {
        MobileRecordSwitchComplete()
    }

    // MARK: - Switch Decision (standalone)

    func evaluateSwitch(activeScore: Double,
                        candidateScore: Double,
                        activeRSRP: Double,
                        isCallActive: Bool,
                        msSinceLastSwitch: Int64,
                        msSinceLastCommand: Int64) -> String {

        return MobileEvaluateSwitchDecision(
            activeScore, candidateScore, activeRSRP,
            isCallActive, msSinceLastSwitch, msSinceLastCommand
        )
    }

    // MARK: - Version

    var version: String {
        return MobileVersion()
    }
}

// MARK: - Phase 5: Background Task Registration (iOS 13+)

import BackgroundTasks

extension NIEManager {

    static let bgTaskIdentifier = "com.smoothswitch.nie.polling"

    /// Call this from AppDelegate.application(_:didFinishLaunchingWithOptions:)
    func registerBackgroundTask() {
        BGTaskScheduler.shared.register(
            forTaskWithIdentifier: NIEManager.bgTaskIdentifier,
            using: nil
        ) { task in
            self.handleBackgroundTask(task: task as! BGProcessingTask)
        }
    }

    /// Call this from applicationDidEnterBackground
    func scheduleBackgroundPolling() {
        let request = BGProcessingTaskRequest(identifier: NIEManager.bgTaskIdentifier)
        request.requiresNetworkConnectivity = true
        request.earliestBeginDate = Date(timeIntervalSinceNow: 15 * 60) // 15 min

        do {
            try BGTaskScheduler.shared.submit(request)
            print("[SmoothSwitch] Background polling scheduled")
        } catch {
            print("[SmoothSwitch] Failed to schedule background task: \(error)")
        }
    }

    private func handleBackgroundTask(task: BGProcessingTask) {
        // Re-schedule so it keeps running
        scheduleBackgroundPolling()

        task.expirationHandler = {
            self.stop()
        }

        // Start engine, collect telemetry, then complete
        start(pollInterval: 10)

        // Simulate a single poll cycle then mark complete
        DispatchQueue.global().asyncAfter(deadline: .now() + 30) {
            task.setTaskCompleted(success: true)
        }
    }
}
