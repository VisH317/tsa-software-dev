import { createClient } from 'redis'

class RateLimit {
    private client: ReturnType<typeof createClient>
    private url: string = 'redis://localhost:6341'
    private limit: number
    private totalRequests: number

    public get getTotalRequests(): number {
        return this.totalRequests
    }

    constructor(lim: number) {
        this.client = createClient({ url: this.url })
        this.limit = lim
        this.totalRequests = 0
    }

    public async connectClient(): Promise<void> {
        await this.client.connect()
    }

    public async validateRequest(): Promise<boolean> {
        const size: number = await this.client.dbSize()
        if(size>=this.limit) return false
        
        this.totalRequests++
        await this.client.set(`${this.totalRequests}`, `${Date.now()}`)
        return true
        // setup the cleanup process
    }
}

export default RateLimit