import sys
sys.path.append('..')

from src.storage import storage
from pyteal import compileTeal, Mode

def compile_contract():
    teal = compileTeal(storage(), mode=Mode.Application, version=10)
    with open("storage.teal", "w") as f:
        f.write(teal)

if __name__ == "__main__":
    compile_contract()
