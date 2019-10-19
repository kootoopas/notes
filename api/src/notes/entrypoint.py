import os

from mongoengine import connect

from notes import create_flask_application, api

if __name__ == '__main__':
    with connect(host=os.environ['NOTES_MONGO_URL'] or 'mongodb://0.0.0.0:27017/notes'):
        create_flask_application(api).run(
            host=os.environ['NOTES_HOST'] or '0.0.0.0',
            port=int(os.environ['NOTES_PORT']) or 8000,
            debug=bool(True if os.environ['NOTES_DEBUG'].lower() is 'true' else False) or True
        )
