#!/usr/bin/env python3
"""
Simple HTTP server to host the survey application locally.
Serves files from the current directory on localhost:8000
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configuration
PORT = 8000
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

def start_server():
    """Start the HTTP server"""
    # Change to the script's directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Create server
    with socketserver.TCPServer((HOST, PORT), SurveyHTTPRequestHandler) as httpd:
        server_url = f"http://{HOST}:{PORT}"
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
