package com.smoothswitch.sim.grpc;

import com.smoothswitch.sim.service.EsimProvisioningService;
import com.smoothswitch.sim.service.PhysicalSimHandler;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.concurrent.CompletableFuture;

@GrpcService
public class SwitchServiceGrpcImpl extends SwitchServiceGrpc.SwitchServiceImplBase {

    private static final Logger log = LoggerFactory.getLogger(SwitchServiceGrpcImpl.class);

    private final PhysicalSimHandler physicalSimHandler;
    private final EsimProvisioningService esimProvisioningService;

    @Autowired
    public SwitchServiceGrpcImpl(PhysicalSimHandler physicalSimHandler,
            EsimProvisioningService esimProvisioningService) {
        this.physicalSimHandler = physicalSimHandler;
        this.esimProvisioningService = esimProvisioningService;
    }

    @Override
    public void executeSwitch(SwitchCommand request, StreamObserver<SwitchResult> responseObserver) {
        log.info("Received SwitchCommand for SessionID: {} -> Route: {}", request.getSessionId(), request.getSimType());

        CompletableFuture<SwitchResult> futureResult;

        if ("esim".equalsIgnoreCase(request.getSimType())) {
            futureResult = esimProvisioningService.executeEsimSwitch(request);
        } else {
            // Default to physical
            futureResult = physicalSimHandler.executePhysicalSwitch(request);
        }

        futureResult.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Switch Execution Pipeline Failed", ex);
                responseObserver.onError(ex);
            } else {
                responseObserver.onNext(result);
                responseObserver.onCompleted();
            }
        });
    }
}
