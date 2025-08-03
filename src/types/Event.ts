class Event {
    public name: string;
    public execute: (...args: any) => void | Promise<void>;
    public once: boolean;

    constructor(
        name: string,
        execute: (...args: any) => void | Promise<void>,
        once: boolean = false
    ) {
        this.name = name; 
        this.execute = execute;
        this.once = once ?? false;
    }
}

export default Event;
