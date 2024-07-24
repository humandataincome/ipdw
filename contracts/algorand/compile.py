import sys
sys.path.append('..')

from contracts.storage_provider import storage_provider
from pyteal import compileTeal, Mode

def compile_contract():
    teal = compileTeal(storage_provider(), mode=Mode.Application, version=6)
    with open("storage.teal", "w") as f:
        f.write(teal)

if __name__ == "__main__":
    compile_contract()
