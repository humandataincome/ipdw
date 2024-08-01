conda create -n algo-env python=3.11
python -m pip install -r requirements.txt

Or

python -m venv venv
source venv/bin/activate # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt

Then

python compile.py

https://developer.algorand.org/docs/get-details/dapps/writing-contracts/pyteal/

openssl base64 < build/approval.teal | tr -d '\n'
openssl base64 < build/clear.teal | tr -d '\n'
