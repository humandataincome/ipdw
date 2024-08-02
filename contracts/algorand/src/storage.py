from pyteal import *


@Subroutine(TealType.uint64)
def set_value():
    key = Txn.application_args[1]
    value = Txn.application_args[2]

    return Seq([
        length := App.box_length(key),
        If(
            length.hasValue(),
            Pop(App.box_delete(key)),
        ),
        If(
            value.__eq__(Bytes('')),
            Int(1),
            Seq([
                Pop(App.box_create(key, Len(value))),
                App.box_put(key, value),
                Int(1)
            ])
        )
    ])


def approval_program():
    handle_creation = Seq([
        App.globalPut(Bytes("name"), Txn.application_args[0]),
        Approve()
    ])

    handle_noop = Cond(
        [Txn.application_args[0] == Bytes("set"), Return(set_value())],
    )

    program = Cond(
        [Txn.application_id() == Int(0), handle_creation],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop],
        [Txn.on_completion() == OnComplete.DeleteApplication, Return(Int(1))],
        [Txn.on_completion() == OnComplete.UpdateApplication, Return(Int(1))],
        [Txn.on_completion() == OnComplete.OptIn, Return(Int(1))],
        [Txn.on_completion() == OnComplete.CloseOut, Return(Int(1))]
    )

    return program


def clear_program():
    return Approve()


if __name__ == "__main__":
    compileTeal(approval_program(), mode=Mode.Application, version=10)
