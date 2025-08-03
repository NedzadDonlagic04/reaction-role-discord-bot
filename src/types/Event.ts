class Event {
    public readonly name: string;
    public readonly execute: (...args: any) => void | Promise<void>;
    public readonly once: boolean;

    constructor(
        name: string,
        execute: (...args: any) => void | Promise<void>,
        once: boolean = false,
    ) {
        this.name = name;
        this.execute = execute;
        this.once = once ?? false;
    }
}

export default Event;
