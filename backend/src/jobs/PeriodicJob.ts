import { CronJob } from 'cron'

export const Frequency = {
  PerMinute: '0 * * * * *',
  PerHour: '0 0 * * * *',
} as const

export default abstract class PeriodicJob {
  job!: CronJob

  abstract getScheduler(): string

  abstract execute(): any

  register() {
    this.job = new CronJob(this.getScheduler(), this.execute.bind(this), null, false, 'Asia/Dhaka')
    this.job.start()
  }
}
