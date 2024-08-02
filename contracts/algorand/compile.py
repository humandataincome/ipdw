import base64
import os

from pyteal import compileTeal, Mode

from src.storage import approval_program, clear_program


def compile_contract():
    if not os.path.exists("build"):
        os.makedirs("build")

    approval_teal = compileTeal(approval_program(), mode=Mode.Application, version=10)
    with open('build/approval.teal', 'w') as f:
        f.write(approval_teal)

    approval_teal_base64 = base64.b64encode(approval_teal.encode()).decode()
    print("Approval Program (Base64 Encoded):")
    print(approval_teal_base64)

    clear_teal = compileTeal(clear_program(), mode=Mode.Application, version=10)
    with open('build/clear.teal', 'w') as f:
        f.write(clear_teal)

    clear_teal_base64 = base64.b64encode(clear_teal.encode()).decode()
    print("Clear Program (Base64 Encoded):")
    print(clear_teal_base64)


if __name__ == "__main__":
    compile_contract()
