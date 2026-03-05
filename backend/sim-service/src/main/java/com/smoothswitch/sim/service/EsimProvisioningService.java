package com.smoothswitch.sim.service;

import com.smoothswitch.sim.grpc.SwitchCommand;
import com.smoothswitch.sim.grpc.SwitchResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@Service
public class EsimProvisioningService {
    private static final Logger log = LoggerFactory.getLogger(EsimProvisioningService.class);
    private static final long RSP_TIMEOUT_MS = 10000; // 10s RSP timeout per LLD

    /**
     * Executes the software-based eSIM profile switch via GSMA SGP.22 SM-DP+
     */
    public CompletableFuture<SwitchResult> executeEsimSwitch(SwitchCommand command) {
        return CompletableFuture.supplyAsync(() -> {
            log.info("[eSIM] Initiating switch to carrier {} via SM-DP+", command.getTargetCarrier());
            long startTime = System.currentTimeMillis();

            try {
                // Call MNO SM-DP+ enableProfile(iccid) via REST
                boolean success = invokeSmDpProvisioningAPI(command.getTargetImsi());

                if (!success) {
                    throw new RuntimeException("SM-DP+ returned failure status");
                }

                long duration = System.currentTimeMillis() - startTime;
                log.info("[eSIM] Switch complete in {} ms", duration);

                return SwitchResult.newBuilder()
                        .setSuccess(true)
                        .setDurationMs((int) duration)
                        .build();

            } catch (Exception e) {
                log.error("[eSIM] Switch failed: {}", e.getMessage());
                handleRollback(command);

                return SwitchResult.newBuilder()
                        .setSuccess(false)
                        .setErrorMessage(e.getMessage())
                        .build();
            }
        }).orTimeout(RSP_TIMEOUT_MS, TimeUnit.MILLISECONDS)
                .exceptionally(ex -> {
                    log.error("[eSIM] Switch timed out after 10s, triggering rollback.");
                    handleRollback(command);

                    return SwitchResult.newBuilder()
                            .setSuccess(false)
                            .setErrorMessage("RSP Timeout: " + ex.getMessage())
                            .build();
                });
    }

    private boolean invokeSmDpProvisioningAPI(String imsi) throws Exception {
        // Simulated network delay (1.5-3s normally)
        Thread.sleep(2000);
        return true;
    }

    private void handleRollback(SwitchCommand command) {
        log.warn("[Rollback] Reverting default profile to previous carrier configuration...");
        // Logic: disableProfile(new) + enableProfile(old)
        // Publish SIM_SWITCH_FAILED to Kafka sim.events
    }
}
