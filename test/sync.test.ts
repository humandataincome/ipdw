import * as Y from 'yjs';

async function main(): Promise<void> {
    const doc = new Y.Doc();
    const arr = doc.getArray('arr');

    let changes = null;
    arr.observe(e => {
        changes = e.changes;
    });

    arr.insert(0, ['a', 'b', 'c']);
    console.log('changes', changes!.delta, arr.toArray());
    changes = null;
    arr.delete(1, 2);
    console.log('changes', changes!.delta, arr.toArray());
    changes = null;
    arr.insert(1, ['z']);
    console.log('changes', changes!.delta, arr.toArray());
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
