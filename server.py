#!/usr/bin/env python3
"""
Simple HTTP server to host the survey application locally.
Serves files from the current directory on localhost:8000
"""

import http.server
import socketserver
import os
import webbrowser
import socket
from pathlib import Path

# Configuration
START_PORT = 8000
HOST = "localhost"

class SurveyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler to serve index.html as default and handle CORS if needed"""
    
    def end_headers(self):
        # Add CORS headers if needed for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        # Serve index.html for root path
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

def find_free_port(start_port=START_PORT, max_attempts=10):
    """Find a free port starting from start_port"""
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind((HOST, port))
                return port
        except OSError:
            continue
    raise RuntimeError(f"Could not find a free port between {start_port} and {start_port + max_attempts}")

def start_server():
    """Start the HTTP server"""
    # Change to the script's directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Find a free port
    try:
        port = find_free_port()
    except RuntimeError as e:
        print(f"❌ Error: {e}")
        return
    
    # Create server
    with socketserver.TCPServer((HOST, port), SurveyHTTPRequestHandler) as httpd:
        server_url = f"http://{HOST}:{port}"
        print(f"🚀 Survey server starting...")
        print(f"📍 Serving files from: {script_dir}")
        print(f"🌐 Server running at: {server_url}")
        print(f"📖 Open your browser to: {server_url}")
        print(f"🛑 Press Ctrl+C to stop the server")
        print("-" * 50)
        
        try:
            # Optionally open browser automatically
            # webbrowser.open(server_url)
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n🛑 Server stopped.")

if __name__ == "__main__":
    start_server()
