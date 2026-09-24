interface D1PreparedStatement { bind(...values: unknown[]): D1PreparedStatement; first<T=unknown>(): Promise<T|null>; all<T=unknown>(): Promise<{results:T[]}>; run(): Promise<unknown>; }
interface D1Database { prepare(query:string): D1PreparedStatement; batch(statements:D1PreparedStatement[]): Promise<unknown[]>; }
interface R2Bucket {}
interface Queue { send(body:unknown): Promise<void>; }
interface Message { body:unknown; ack():void; retry():void; }
interface MessageBatch { messages: Message[]; }
