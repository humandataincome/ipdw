from pyteal import *

def storage_provider():
    handle_noop = Seq([
        Cond(
            [Txn.application_args[0] == Bytes("set"), set_value()],
            [Txn.application_args[0] == Bytes("has"), has_key()],
            [Txn.application_args[0] == Bytes("get"), get_value()],
            [Txn.application_args[0] == Bytes("ls"), list_keys()],
            [Txn.application_args[0] == Bytes("clear"), clear_all()]
        )
    ])

    @Subroutine(TealType.none)
    def set_value():
        key = Txn.application_args[1]
        value = Txn.application_args[2]
        return Seq([
            App.box_put(key, value),
            Approve()
        ])

    @Subroutine(TealType.uint64)
    def has_key():
        key = Txn.application_args[1]
        return Seq([
            App.box_length(key),
            Return(Int(1))
        ])

    @Subroutine(TealType.bytes)
    def get_value():
        key = Txn.application_args[1]
        return Seq([
            App.box_get(key),
            Return(ScratchVar().load())
        ])

    @Subroutine(TealType.bytes)
    def list_keys():
        i = ScratchVar(TealType.uint64)
        key = ScratchVar(TealType.bytes)
        return Seq([
            i.store(Int(0)),
            key.store(Bytes("")),
            While(i.load() < App.box_length(Bytes(""))).Do(
                key.store(concat(key.load(), App.box_extract(Bytes(""), i.load(), Int(64)))),
                i.store(i.load() + Int(64))
            ),
            Return(key.load())
        ])

    @Subroutine(TealType.none)
    def clear_all():
        i = ScratchVar(TealType.uint64)
        return Seq([
            i.store(Int(0)),
            While(i.load() < App.box_length(Bytes(""))).Do(
                App.box_delete(App.box_extract(Bytes(""), i.load(), Int(64))),
                i.store(i.load() + Int(64))
            ),
            Approve()
        ])

    return handle_noop

if __name__ == "__main__":
    print(compileTeal(storage_provider(), mode=Mode.Application, version=6))
