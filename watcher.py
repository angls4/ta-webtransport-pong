import time
import subprocess
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler


class MyHandler(PatternMatchingEventHandler):
    def __init__(self):
        super().__init__(patterns=["*.py"])
        self.process = None

    def on_modified(self, event):
        print(f"{event.src_path} has been modified")
        self.restart_script()

    def on_created(self, event):
        print(f"{event.src_path} has been created")
        self.restart_script()

    def restart_script(self):
        if self.process and self.process.poll() is None:
            print("Terminating existing process...")
            self.process.terminate()
            self.process.wait()

        try:
            print("Starting new process...")
            self.process = subprocess.Popen(
                [
                    "python",
                    "http3_server.py",
                    "--certificate",
                    "ssl_cert.pem",
                    "--private-key",
                    "ssl_key.pem",
                ]
            )
            self.process.wait()
        except Exception as e:
            print(f"Process failed with error: {e}")


if __name__ == "__main__":
    path = "."  # Watch the current directory
    event_handler = MyHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    print("Monitoring started. Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
    if event_handler.process and event_handler.process.poll() is None:
        event_handler.process.terminate()
