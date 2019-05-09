from flask import Flask , send_from_directory , flash, request, redirect, url_for
import json
import requests
from flask import jsonify
from test2 import test
from werkzeug.utils import secure_filename
import os


app = Flask(__name__)
app.register_blueprint(test)

UPLOAD_FOLDER = "datasets"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/uploads',methods=['POST'])
def upload_file():
        if request.method == 'POST':    
                # check if the post request has the file part
                if 'file' not in request.files:
                        flash('No file part')
                        return redirect(request.url)
                file = request.files['file']
                # if user does not select file, browser also
                # submit an empty part without filename
                if file.filename == '':
                        flash('No selected file')
                        return redirect(request.url)
                if file :
                        filename = secure_filename(file.filename)
                        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                        return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)


@app.route('/')
def index():
    # r = requests.get(
    #   'http://localhost:3001/absenteeism/countAbsenteeism/2019-03-25/2019-04-03/5c926640db149e155096dfa9')
    # print(r.json()['number of days absent'])
    return jsonify(dict({
        'a':["hello","world"] , 
        'b':"mahdi"
        }))

if __name__ == '__main__':
    app.run(debug=True)