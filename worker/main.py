import os
import json
import time
from pathlib import Path

import redis
import requests
from dotenv import load_dotenv
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_QUEUE = os.getenv("REDIS_QUEUE", "ping_tasks")

INFLUX_URL = os.getenv("INFLUX_URL", "http://localhost:8086")
INFLUX_TOKEN = os.getenv("INFLUX_TOKEN", "password123")
INFLUX_ORG = os.getenv("INFLUX_ORG", "sentinel_org")
INFLUX_BUCKET = os.getenv("INFLUX_BUCKET", "latency_metrics")

BACKEND_WEBHOOK_URL = os.getenv(
    "BACKEND_WEBHOOK_URL", "http://localhost:8080/api/notifications/report"
)


def report_failure(endpoint_id, message):
    payload = {
        "endpoint_id": endpoint_id,
        "message": message
    }
    try:
        response = requests.post(BACKEND_WEBHOOK_URL, json=payload, timeout=5)
        if 200 <= response.status_code < 300:
            print(f"Reported failure for endpoint {endpoint_id}: {message}")
        else:
            print(
                f"[Webhook Error] Failed to report endpoint {endpoint_id}. "
                f"Status: {response.status_code}, Body: {response.text}"
            )
    except Exception as e:
        print(f"Failed to reach backend webhook: {e}")
    
def process_task(task_json):
    task = json.loads(task_json)
    endpoint_id = task['id']
    url = task['url']
    method = task.get('method', 'GET')
    print("Checking ", url)

    start_time = time.time()
    try:
        response = requests.request(method, url, timeout=10)
        latency = (time.time() - start_time) * 1000
        status_code = response.status_code

        point = Point("ping") \
            .tag("endpoint_id", endpoint_id) \
            .field("latency", latency) \
            .field("status", status_code) \
            .time(time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), WritePrecision.NS)

        write_api.write(bucket=INFLUX_BUCKET, org=INFLUX_ORG, record=point)
        print(f"{url} | Latency: {latency:.2f} ms | Status: {status_code}")
        print(f" [DB] Successfully recorded to InfluxDB bucket: {INFLUX_BUCKET}")
        if status_code != 200:
            report_failure(endpoint_id, f"Service returned status code {status_code}")
    except Exception as e:
        latency = (time.time() - start_time) * 1000
        
        # Record failed ping to InfluxDB with status 0 indicating failure
        point = Point("ping") \
            .tag("endpoint_id", endpoint_id) \
            .field("latency", latency) \
            .field("status", 0) \
            .time(time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), WritePrecision.NS)
        
        try:
            write_api.write(bucket=INFLUX_BUCKET, org=INFLUX_ORG, record=point)
            print(f" [DB] Recorded failure to InfluxDB bucket: {INFLUX_BUCKET}")
        except Exception as db_error:
            print(f" [DB] Failed to write to InfluxDB: {db_error}")
        
        report_failure(endpoint_id, "Connection failed: " + str(e))


if __name__ == "__main__":
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    influx_client = InfluxDBClient(url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG)
    write_api = influx_client.write_api(write_options=SYNCHRONOUS)

    print("Worker started. Waiting for tasks to queue.")
    while True:
        _, task_data = r.blpop(REDIS_QUEUE)
        process_task(task_data)
