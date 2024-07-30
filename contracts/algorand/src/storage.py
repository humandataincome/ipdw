from pyteal import *


def storage():
    # Subroutines for managing storage operations
    @Subroutine(TealType.bytes)
    def set_op(key: Expr, value: Expr) -> Expr:
        index_key = Bytes("__index__")
        current_index = App.box_get(index_key)
        new_index = If(current_index.hasValue(), Concat(current_index.value(), key), key)

        return Seq([
            App.box_put(key, value),
            If(Not(App.box_length(key).hasValue()),
               App.box_put(index_key, new_index)),
            Bytes("success")
        ])

    @Subroutine(TealType.bytes)
    def has_op(key: Expr) -> Expr:
        return If(App.box_length(key).hasValue(), Bytes("1"), Bytes("0"))

    @Subroutine(TealType.bytes)
    def get_op(key: Expr) -> Expr:
        key_value = App.box_get(key)
        return If(key_value.hasValue(), key_value.value(), Bytes(""))

    @Subroutine(TealType.bytes)
    def ls_op() -> Expr:
        index = App.box_get(Bytes("__index__"))
        return If(index.hasValue(), index.value(), Bytes(""))

    @Subroutine(TealType.none)
    def clear_keys() -> Expr:
        index = App.box_get(Bytes("__index__")).value()
        return Seq([
            For(
                (key := ScratchVar(TealType.bytes)),
                (i := ScratchVar(TealType.uint64)).store(Int(0)),
                i.load() < Len(index),
                i.store(i.load() + Int(32))
            ).Do(
                Seq([
                    key.store(Extract(index, i.load(), Int(32))),
                    App.box_delete(key.load())
                ])
            ),
            App.box_put(Bytes("__index__"), Bytes(""))
        ])

    @Subroutine(TealType.bytes)
    def clear_op() -> Expr:
        return Seq([
            clear_keys(),
            Bytes("success")
        ])

    program = Cond(
        [Txn.application_args[0] == Bytes("set"), set_op(Txn.application_args[1], Txn.application_args[2])],
        [Txn.application_args[0] == Bytes("has"), has_op(Txn.application_args[1])],
        [Txn.application_args[0] == Bytes("get"), get_op(Txn.application_args[1])],
        [Txn.application_args[0] == Bytes("ls"), ls_op()],
        [Txn.application_args[0] == Bytes("clear"), clear_op()],
    )

    return program


if __name__ == "__main__":
    print(compileTeal(storage(), mode=Mode.Application, version=10))
