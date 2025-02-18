require('dotenv').config()

import { createHttpServer } from './providers/HttpServer'
import { registerStartupJobs } from './providers/StartupJobScheduler'

async function main() {
  const httpServer = await createHttpServer()
  httpServer.listen(process.env.HTTP_PORT, () => {
    registerStartupJobs()

    console.log(new Date(), `HTTP server is running on port: ${process.env.HTTP_PORT}`)
  })
}

main()
