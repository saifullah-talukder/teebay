import { DatabaseInitializationJob } from '../jobs/DatabaseInitializationJob'

export const registerStartupJobs = () => {
  new DatabaseInitializationJob().register()
}
