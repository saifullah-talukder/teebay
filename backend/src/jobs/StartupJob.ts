export default abstract class StartupJob {
  constructor() {}

  abstract execute(): any

  register() {
    this.execute.bind(this)()
  }
}
