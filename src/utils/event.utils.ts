type TypedEventListener<M, T extends keyof M> = (
    evt: M[T]
) => void | Promise<void>;

interface TypedEventListenerObject<M, T extends keyof M> {
    handleEvent: (evt: M[T]) => void | Promise<void>;
}

type ValueIsEvent<T> = {
    [key in keyof T]: Event;
};

type TypedEventListenerOrEventListenerObject<M, T extends keyof M> =
    | TypedEventListener<M, T>
    | TypedEventListenerObject<M, T>;

export interface TypedEventTarget<M extends ValueIsEvent<M>> {
    addEventListener: <T extends keyof M & string>(
        type: T,
        listener: TypedEventListenerOrEventListenerObject<M, T> | null,
        options?: boolean | AddEventListenerOptions
    ) => void;

    removeEventListener: <T extends keyof M & string>(
        type: T,
        callback: TypedEventListenerOrEventListenerObject<M, T> | null,
        options?: EventListenerOptions | boolean
    ) => void;
    dispatchEvent: (event: Event) => boolean;
}

export class TypedEventTarget<M extends ValueIsEvent<M>> extends EventTarget {
    public dispatchTypedEvent<T extends keyof M>(
        _type: T,
        event: M[T]
    ): boolean {
        return super.dispatchEvent(event);
    }
}

interface CustomEventInit<T = any> extends EventInit {
    detail?: T;
}

export class TypedCustomEvent<T> extends Event {
    readonly #detail;

    constructor(type: string, eventInitDict?: CustomEventInit<T>) {
        super(type, eventInitDict);
        this.#detail = eventInitDict?.detail ?? null;
    }

    get detail() {
        return this.#detail;
    }
}
