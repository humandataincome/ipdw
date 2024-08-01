import os

from src.storage import approval_program, clear_program
from pyteal import compileTeal, Mode


def compile_contract():
    if not os.path.exists("build"):
        os.makedirs("build")

    with open('build/approval.teal', 'w') as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=10)
        f.write(compiled)

    with open('build/clear.teal', 'w') as f:
        compiled = compileTeal(clear_program(), mode=Mode.Application, version=10)
        f.write(compiled)


if __name__ == "__main__":
    compile_contract()
