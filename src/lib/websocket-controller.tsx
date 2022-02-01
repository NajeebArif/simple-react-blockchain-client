import { Block, Transaction } from "./blockchain-node";
import { uuid } from "./crypto";
import { Message, MessageTypes, UUID } from "./message";

interface PromiseExecutor<T> {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (value?: any ) => void;
}

export class WebsocketController{
    private websocket!: Promise<WebSocket>;
    private messageCallback!: (message: Message) => void;
    private readonly messagesAwaitingReply = new Map<UUID, PromiseExecutor<Message>>();

    private get url(): string{
        const protocol = window.location.protocol === 'https'? 'wss':'ws';
        const hostName = process.env.REACT_APP_WS_PROXY_HOSTNAME || window.location.host;
        return `${protocol}://${hostName}`;
    }

    connect(messageCallback: (message: Message)=> void): Promise<WebSocket>{
        this.messageCallback = messageCallback;
        return this.websocket = new Promise((resolve, reject) => {
            const ws = new WebSocket(this.url);
            ws.addEventListener('open', ()=>resolve(ws));
            ws.addEventListener('error', err=>reject(err));
            ws.addEventListener('message', this.onMessageReceived)
        })
    }

    disconnect(){
        this.websocket.then(ws=>ws.close());
    }

    private readonly onMessageReceived = (event: MessageEvent) =>{
        const message = JSON.parse(event.data) as Message;
        if(this.messagesAwaitingReply.has(message.correlationId)){
            this.messagesAwaitingReply.get(message.correlationId)!.resolve(message);
            this.messagesAwaitingReply.delete(message.correlationId);
        }else {
            this.messageCallback(message);
        }
    }

    async send(message:Partial<Message>, awaitForReply: boolean = false): Promise<Message> {
        return new Promise(async (resolve, reject)=>{
            if(awaitForReply){
                this.messagesAwaitingReply.set(message.correlationId!, {resolve, reject})
            }
            this.websocket.then(
                ws => ws.send(JSON.stringify(message)),
                ()=> this.messagesAwaitingReply.delete(message.correlationId!)
            );
        })
    }

    async requestLongestChain() : Promise<Block[]>{
        const reply = await this.send({
            type: MessageTypes.LONGEST_CHAIN_REQUEST,
            correlationId: uuid()
        }, true);
        return reply.payload;
    }

    requestNewBlock(transactions: Transaction[]): void{
        this.send({
            type: MessageTypes.NEW_BLOCK_REQUEST,
            correlationId: uuid(),
            payload: transactions
        });
    }

    announceNewBlock(block: Block): void{
        this.send({
            type: MessageTypes.NEW_BLOCK_ANNOUNCEMENT,
            correlationId: uuid(),
            payload: block
        });
    }
}