from flask import Flask, render_template
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Beta'
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins for CORS

# Basic route to serve the chat page
@app.route('/')
def index():
    return render_template('chat.html')

@app.route('/home')
def Home():
    return render_template("index.html")

# Handle messages sent by clients
@socketio.on('message')
def handletMessage(msg):
    print('Message: ' + msg)
    if msg != "User connected!":
        send(msg, broadcast=True)  # Broadcast the message to all connected clients

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=3000, debug=True)  # Set host and port
