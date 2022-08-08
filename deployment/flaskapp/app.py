from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import numpy as np
import pandas as pd
import json
from xgboost import XGBClassifier
from sklearn.preprocessing import MinMaxScaler
import boto3
from datetime import datetime

session = boto3.Session(
    aws_access_key_id="AKIASVGLKLB6GCFTIT63",
    aws_secret_access_key="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",
)

app = Flask(__name__)
CORS(app, support_credentials=True)

prod_model = XGBClassifier()
prod_mms = None


@app.route('/')
@cross_origin(origin='*')
def hello_world():
    return 'Hello World!'


@app.route('/train', methods=['POST'])
@cross_origin(origin='*')
def train():
    global prod_mms
    df_raw = pd.read_csv("credit_raw.csv", on_bad_lines='skip')
    prod_mms = MinMaxScaler()
    prod_mms.fit_transform(df_raw.iloc[:, 0:-1])
    prod_model.load_model("xgb")
    return jsonify(isError=False,
                   message="Success",
                   statusCode=200,
                   data=None), 200


@app.route('/predict', methods=['POST'])
@cross_origin(origin='*')
def predict():
    if request.method == 'POST':
        data = json.loads(request.data)
        new = {}
        for key, value in data.items():
            new[key] = [value]
        df_raw = pd.DataFrame.from_dict(new)

        if prod_mms:
            df_scaled = prod_mms.transform(df_raw)
            if prod_model:
                result = prod_model.predict(df_scaled)[0]
                prob = prod_model.predict_proba(df_scaled)
                data["prediction"] = int(result)
                data["prediction_prob"] = str(prob)
                data["itemId"] = ''.join(
                    str(datetime.now()).replace(" ", "-").split("."))

                dynamodb = session.resource('dynamodb')
                table = dynamodb.Table('CSCI5901Project')
                res = table.put_item(Item=data)

                response = {}
                response["result"] = int(result)
                return jsonify(isError=False,
                               message="Success",
                               statusCode=200,
                               data=response), 200

    return jsonify(isError=False,
                   message="Success",
                   statusCode=200,
                   data=None), 200


if __name__ == "__main__":
    app.run()
