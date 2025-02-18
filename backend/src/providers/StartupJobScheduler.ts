import { DatabaseInitializationJob } from '../jobs/DatabaseInitializationJob'

export function registerStartupJobs() {
  new DatabaseInitializationJob().register()
}
