package com.smoothswitch.sim.service;

import com.smoothswitch.sim.grpc.SwitchCommand;
import com.smoothswitch.sim.grpc.SwitchResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class PhysicalSimHandler {
    private static final Logger log = LoggerFactory.getLogger(PhysicalSimHandler.class);

    /**
     * Executes the switch on a physical dual-SIM Android or iOS device.
     * Takes roughly 3-8 seconds for baseband power cycle.
     */
    public CompletableFuture<SwitchResult> executePhysicalSwitch(SwitchCommand command) {
        return CompletableFuture.supplyAsync(() -> {
            log.info("[Physical SIM] Initiating switch to carrier {} for IMSI {}",
                    command.getTargetCarrier(), command.getTargetImsi());

            long startTime = System.currentTimeMillis();

            try {
                // Simulated Android Telephony Manager / iOS CTCellularPlanProvisioning
                // power cycle delay
                Thread.sleep(5000);

                log.info("[Physical SIM] Switch complete for IMSI {}", command.getTargetImsi());

                long duration = System.currentTimeMillis() - startTime;
                return SwitchResult.newBuilder()
                        .setSuccess(true)
                        .setDurationMs((int) duration)
                        .build();

            } catch (InterruptedException e) {
                log.error("[Physical SIM] Switch interrupted", e);
                Thread.currentThread().interrupt();
                return SwitchResult.newBuilder()
                        .setSuccess(false)
                        .setErrorMessage("Switch interrupted: " + e.getMessage())
                        .build();
            }
        });
    }
}
