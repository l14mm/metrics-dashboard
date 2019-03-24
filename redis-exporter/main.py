import redis
from flask import Flask, jsonify, Response

app = Flask(__name__)

r = redis.Redis(host='redis', port=6379, db=0)


@app.route('/metrics')
def main():
    metrics = '# HELP keyword Keywords found in tweets.\n# TYPE keyword counter\n'
    keys = r.keys()
    for key in keys:
        metrics += key.decode('utf-8') + ' ' + \
            r.get(key).decode('utf-8') + '\n'
    return Response(metrics, mimetype='text/plain')


if __name__ == "__main__":
    app.run(host='0.0.0.0')
