export abstract class MessageService {

    constructor() {
        this.messageWorker();
    }
    private static started = false;
    private static timer = 0;
    private static interval = 400;
    private messages: Array<{
        id: number,
        text: string,
        timeout: number,
        persit: boolean
    }> = new Array();
    private lastId = 0;

    private static destroyWorker() {
        clearInterval(MessageService.timer);
    }

    public push(message: {
        text: string,
        timeout: number,
        persit: boolean
    }) {

        this.messages.push({
            text: message.text,
            persit: message.persit,
            timeout: message.timeout,
            id: this.lastId
        });
        this.lastId++;
    }



    public clear() {
        this.messages = [];
    }

    private messageWorker(): void {
        if (!MessageService.started) {
            MessageService.timer = window.setInterval(_ => {
                if (this.messages.length > 0) {
                    this.show(this.messages.pop());
                }
            }, MessageService.interval);
            MessageService.started = true;
        }

    }

    protected abstract show(param: {
        text: string,
        timeout: number; persit: boolean
    }): void;
}
