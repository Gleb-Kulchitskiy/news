import {scheduleJob,} from 'node-schedule'

export class Scheduler {
    private job = scheduleJob

    createAndRunScheduledTask(cron: string, callback: any): void {
        this.job(cron, callback)
    }
}