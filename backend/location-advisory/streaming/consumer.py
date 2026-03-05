import json
import logging
import redis
from confluent_kafka import Consumer, KafkaError

logger = logging.getLogger(__name__)

class SwitchEventConsumer:
    """
    Kafka consumer that listens to NIE switch events on 'network.switch.events'.
    It extracts the historical signal strength logged during the switch
    and aggregates it into the appropriate H3 grid cell in Redis.
    """
    
    def __init__(self, kafka_config: dict, redis_client: redis.Redis):
        self.consumer = Consumer(kafka_config)
        self.redis = redis_client
        self.topic = "network.switch.events"
        
    def start(self):
        self.consumer.subscribe([self.topic])
        logger.info(f"Subscribed to {self.topic}")
        
        try:
            while True:
                msg = self.consumer.poll(1.0)
                
                if msg is None:
                    continue
                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        continue
                    else:
                        logger.error(f"Kafka error: {msg.error()}")
                        break

                self._process_message(msg.value())
                
        except KeyboardInterrupt:
            logger.info("Kafka consumer shutting down...")
        finally:
            self.consumer.close()

    def _process_message(self, message_bytes: bytes):
        try:
            data = json.loads(message_bytes.decode('utf-8'))
            
            # Extract H3 location if the NIE attached it, or calculate if GPS included
            # In LLD, NIE optionally provides grid data directly via client SDK payload
            h3_index = data.get("h3_index")
            if not h3_index:
                return # Can't aggregate without location
                
            scores = json.loads(data.get("quality_scores_json", "{}"))
            
            # Update EMA (Exponential Moving Average) in Redis for this hex
            for carrier, score in scores.items():
                self._update_ema(h3_index, carrier, float(score))
                
        except Exception as e:
            logger.error(f"Error processing message: {e}")

    def _update_ema(self, h3_index: str, carrier: str, new_score: float):
        """
        Calculates an Exponential Moving Average for the grid cell to keep the
        advisory score smooth and resistant to single-device anomalies.
        """
        key = f"advisory:h3:{h3_index}:{carrier}"
        alpha = 0.2
        
        current = self.redis.get(key)
        if current is None:
            self.redis.set(key, new_score, ex=86400 * 7) # 7 day TTL
        else:
            ema = (new_score * alpha) + (float(current) * (1 - alpha))
            self.redis.set(key, ema, ex=86400 * 7)
