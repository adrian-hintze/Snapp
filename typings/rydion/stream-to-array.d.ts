declare module 'stream-to-array' {
    function streamToArray(stream: NodeJS.ReadableStream): Promise<Array<Buffer>>;
    export = streamToArray;
}
