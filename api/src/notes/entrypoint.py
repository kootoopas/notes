import os

from mongoengine import connect

from notes import create_flask_application, api

if __name__ == '__main__':
    with connect(host=os.environ['NOTES_MONGO_URL']):
        create_flask_application(api).run(debug=True)
