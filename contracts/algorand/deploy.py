import sys
sys.path.append('..')

from algosdk.v2client import algod
from algosdk import account, transaction
from utils.algorand_helper import compile_program, wait_for_confirmation
import os
from dotenv import load_dotenv

load_dotenv()

def deploy_contract():
    # Initialize Algod client
    algod_address = "https://testnet-algorand.api.purestake.io/ps2"
    algod_token = os.getenv("ALGOD_TOKEN")
    headers = {
        "X-API-Key": algod_token,
    }
    algod_client = algod.AlgodClient(algod_token, algod_address, headers)

    # Load account from mnemonic
    mnemonic = os.getenv("MNEMONIC")
    private_key = mnemonic.to_private_key(mnemonic)
    sender = account.address_from_private_key(private_key)

    # Read TEAL file
    with open("storage.teal", "r") as f:
        teal = f.read()

    # Compile TEAL to binary
    response = algod_client.compile(teal)
    approval_program = base64.b64decode(response['result'])

    # Clear program (for simplicity, we're using a program that always approves)
    clear_teal = "int 1"
    response = algod_client.compile(clear_teal)
    clear_program = base64.b64decode(response['result'])

    # Get suggested parameters
    params = algod_client.suggested_params()

    # Create unsigned transaction
    txn = transaction.ApplicationCreateTxn(
        sender=sender,
        sp=params,
        on_complete=transaction.OnComplete.NoOpOC,
        approval_program=approval_program,
        clear_program=clear_program,
        global_schema=transaction.StateSchema(num_uints=0, num_byte_slices=0),
        local_schema=transaction.StateSchema(num_uints=0, num_byte_slices=0)
    )

    # Sign transaction
    signed_txn = txn.sign(private_key)

    # Send transaction
    tx_id = algod_client.send_transaction(signed_txn)

    # Wait for confirmation
    wait_for_confirmation(algod_client, tx_id)

    # Display results
    transaction_response = algod_client.pending_transaction_info(tx_id)
    app_id = transaction_response['application-index']
    print("Created new app-id:", app_id)

if __name__ == "__main__":
    deploy_contract()
