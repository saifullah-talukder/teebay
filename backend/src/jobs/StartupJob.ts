export default abstract class StartupJob {
  abstract execute(): any

  register() {
    this.execute.bind(this)()
  }
}
