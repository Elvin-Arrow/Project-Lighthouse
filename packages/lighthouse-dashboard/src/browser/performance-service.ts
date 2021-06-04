import * as fs from "fs";
import path = require('path');
const homedir = require('os').homedir();
import Store = require("electron-store");

export class PerformanceService {
    private readonly store: Store = new Store();

    public updatePerformanceStats(): void {
        // Look for stats
        let performanceStatsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'performance_stats.json');

        if (fs.existsSync(performanceStatsPath)) {
            console.info(`Reading the performance stats json`);
            let performanceStats = JSON.parse(fs.readFileSync(performanceStatsPath, 'utf-8'));
            console.info(`Read the performance stats json successfully`);
            if (Array.isArray(performanceStats)) {
                let index = 0;
                performanceStats.forEach(stat => {
                    let avgScores = this.getAreaWiseAverageScores();
                    stat.performanceScore = avgScores[index];
                    index++;
                });
            }

            fs.writeFileSync(performanceStats, JSON.stringify(performanceStats));
        }
    }

    public getNumberOfAttemptedAssignments(area: string): number {
        let count = 0;
        let stats = this.getAssignmentsStats(area);

        stats.forEach(stat => {
            if (stat.completed) {
                count++;
            }
        })

        return count;
    }

    public getAverageAssignmentScore(area: string): number {
        let score = 0;
        let stats = this.getAssignmentsStats(area);

        stats.forEach(stat => {
            score += stat.score;
        });

        return Math.fround(score / stats.length);
    }

    private getAssignmentsStats(area: string): Record<string, any>[] {
        let assignments: Record<string, any>[] = [];

        let assignmentStatsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

        if (fs.existsSync(assignmentStatsPath)) {
            let assignmentStats = JSON.parse(fs.readFileSync(assignmentStatsPath, 'utf-8'));

            if (Array.isArray(assignmentStats)) {
                assignmentStats.forEach(stat => {
                    if (stat.area == area) {
                        assignments.push(stat);
                    }
                });
            }
        }

        return assignments;
    }

    public getAreawisePerformance(): number[] {
        // Get averaged scores for each area
        let avgScores = this.getAreaWiseAverageScores();
        console.info(`Average scores: ${avgScores}`);

        // Get averaged compilation for each area
        let avgCompilations = this.getAreaWiseAverageCompilations();
        let compilations = this.getAreaWiseCompilations();
        console.info(`Average compilations: ${avgCompilations}\nNumber of compilations: ${compilations}`);

        // Get averaged errors for each area
        let avgErrors = this.getAreaWiseAverageErrors();
        let errors = this.getAreaWiseErrors();
        console.info(`Average errors: ${avgErrors}\nNumber of errors: ${errors}`);

        // Get averaged time for each area
        let avgTime = this.getAreaWiseAverageTime();
        let totalTime = this.getAreaWiseTimeSpent();
        console.info(`Average time: ${avgTime}\nTotal time: ${totalTime}`);


        let areaWisePerformance = [];
        for (let index = 0; index < avgScores.length; index++) {
            let s = (avgScores[index] / 10) * 50
            let c = (Math.round(avgCompilations[index] / compilations[index])) * 20
            let e = (Math.round(avgErrors[index] / errors[index])) * 10;
            let t = (Math.round(avgTime[index] / totalTime[index])) * 20;

            console.info(`Compilations: ${c}\nErrors: ${e}\nTime: ${t}`);

            areaWisePerformance[index] = s + (50 - c - e - t);
        }

        return areaWisePerformance;
    }

    public getOverallPerformance() {
        // Get all compilations
        // Read assignment stats
        let statsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

        if (fs.existsSync(statsPath)) {
            let assignmentStats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
            let performance: number = 0;

            let scores: number[] = [];
            let comps: number[] = [];
            let errs: number[] = [];
            let times: number[] = [];
            let ncomps: number[] = [];
            let nerrs: number[] = [];
            let ntimes: number[] = [];
            if (Array.isArray(assignmentStats)) {
                assignmentStats.forEach(stat => {
                    scores.push(stat.score);
                    comps.push(stat.numberOfCompilations);
                    errs.push(stat.numberOfErrors);
                    times.push(stat.timespent);
                });

                comps.forEach(comp => {
                    ncomps.push(this.normalize(comps, comp));
                });

                errs.forEach(err => {
                    nerrs.push(this.normalize(errs, err));
                });

                times.forEach(time => {
                    ntimes.push(this.normalize(times, time));
                });

                let cAvg = ncomps.reduce((a, b) => a + b, 0) / ncomps.length;

                console.info(`Compilation average: ${cAvg}`);

                let eAvg = nerrs.reduce((a, b) => a + b, 0) / nerrs.length;

                console.info(`Errors average: ${eAvg}`);

                let tAvg = ntimes.reduce((a, b) => a + b, 0) / ntimes.length;

                console.info(`Average timespent: ${tAvg}`);

                let sAvg = scores.reduce((a, b) => a + b, 0) / scores.length;

                console.info(`Average scores: ${sAvg}`);

                performance = ((sAvg / 10) * 50) + (50 - ((cAvg / ncomps.reduce((a, b) => a + b, 0)) * 20) - ((eAvg / nerrs.reduce((a, b) => a + b, 0)) * 10) - ((tAvg / ntimes.reduce((a, b) => a + b, 0)) * 20));

                console.info(`Student performance: ${performance}`);
            }
        }
    }

    protected normalize(items: number[], item: number) {
        let max = Math.max.apply(Math, items);
        let min = Math.min.apply(Math, items);

        return (item - min) / (max - min);
    }

    private getAreaWiseAverageScores(): Array<number> {
        let scores: Array<number> = [];
        let count: Array<number> = [];
        let areawiseAvgScore: Array<number> = [];

        for (let index = 0; index < 5; index++) {
            scores[index] = 0;
            count[index] = 0;
            areawiseAvgScore[index] = 0;
        }

        // Read assignment stats
        let statsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

        if (fs.existsSync(statsPath)) {
            let assignmentStats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

            // Always true
            if (Array.isArray(assignmentStats)) {
                // Read scores for each assignment
                assignmentStats.forEach(stat => {
                    switch (stat.area) {
                        case 'basics':
                            scores[0] += stat.score;
                            count[0]++;
                            break;
                        case 'conditionals':
                            scores[1] += stat.score;
                            count[1]++;
                            break;

                        case 'functions':
                            scores[4] += stat.score;
                            count[4]++;
                            break;

                        case 'lists':
                            scores[3] += stat.score;
                            count[3]++;
                            break;

                        case 'loops':
                            scores[2] += stat.score;
                            count[2]++;
                            break;
                        default:
                            break;
                    }
                });
            }
        }

        for (let i = 0; i < scores.length; i++) {
            areawiseAvgScore[i] = scores[i] / count[i];
        }

        return areawiseAvgScore;
    }

    private getAreaWiseAverageCompilations() {
        let compilations: Array<number> = [];
        let count: Array<number> = [];
        let areaWiseAvgCompilations: Array<number> = [];

        for (let index = 0; index < 5; index++) {
            compilations[index] = 0;
            count[index] = 0;
            areaWiseAvgCompilations[index] = 0;
        }

        // Read assignment stats
        let statsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

        if (fs.existsSync(statsPath)) {
            let assignmentStats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

            // Always true
            if (Array.isArray(assignmentStats)) {
                // Read scores for each assignment
                assignmentStats.forEach(stat => {
                    switch (stat.area) {
                        case 'basics':

                            compilations[0] += stat.numberOfCompilations;
                            count[0]++;
                            break;
                        case 'conditionals':
                            compilations[1] += stat.numberOfCompilations;
                            count[1]++;
                            break;

                        case 'functions':
                            compilations[4] += stat.numberOfCompilations;
                            count[4]++;
                            break;

                        case 'lists':
                            compilations[3] += stat.numberOfCompilations;
                            count[3]++;
                            break;

                        case 'loops':
                            compilations[2] += stat.numberOfCompilations;
                            count[2]++;
                            break;
                        default:
                            break;
                    }
                });
            }
        }

        for (let i = 0; i < compilations.length; i++) {
            areaWiseAvgCompilations[i] = compilations[i] / count[i];
            areaWiseAvgCompilations[i] = Math.abs(areaWiseAvgCompilations[i] - compilations[i]);
        }

        return areaWiseAvgCompilations;
    }

    private getAreaWiseAverageErrors(): Array<number> {
        let errors: Array<number> = [];
        let count: Array<number> = [];
        let areaWiseAvgErrors: Array<number> = [];

        for (let index = 0; index < 5; index++) {
            errors[index] = 0;
            count[index] = 0;
            areaWiseAvgErrors[index] = 0;
        }

        // Read assignment stats
        let statsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

        if (fs.existsSync(statsPath)) {
            let assignmentStats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

            // Always true
            if (Array.isArray(assignmentStats)) {
                // Read scores for each assignment
                assignmentStats.forEach(stat => {
                    switch (stat.area) {
                        case 'basics':
                            errors[0] += stat.numberOfErrors;
                            count[0]++;
                            break;
                        case 'conditionals':
                            errors[1] += stat.numberOfErrors;
                            count[1]++;
                            break;

                        case 'functions':
                            errors[4] += stat.numberOfErrors;
                            count[4]++;
                            break;

                        case 'lists':
                            errors[3] += stat.numberOfErrors;
                            count[3]++;
                            break;

                        case 'loops':
                            errors[2] += stat.numberOfErrors;
                            count[2]++;
                            break;
                        default:
                            break;
                    }
                });
            }
        }

        for (let i = 0; i < errors.length; i++) {
            areaWiseAvgErrors[i] = errors[i] / count[i];
            areaWiseAvgErrors[i] = Math.abs(areaWiseAvgErrors[i] - errors[i]);
        }

        return areaWiseAvgErrors;
    }

    private getAreaWiseAverageTime(): Array<number> {
        let time: Array<number> = [];
        let count: Array<number> = [];
        let areaWiseAvgTime: Array<number> = [];

        for (let index = 0; index < 5; index++) {
            time[index] = 0;
            count[index] = 0;
            areaWiseAvgTime[index] = 0;
        }

        // Read assignment stats
        let statsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

        if (fs.existsSync(statsPath)) {
            let assignmentStats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

            // Always true
            if (Array.isArray(assignmentStats)) {
                // Read scores for each assignment
                assignmentStats.forEach(stat => {
                    switch (stat.area) {
                        case 'basics':
                            time[0] += this.toMinutes(stat.timespent);
                            count[0]++;
                            break;
                        case 'conditionals':
                            time[1] += this.toMinutes(stat.timespent);
                            count[1]++;
                            break;

                        case 'functions':
                            time[4] += this.toMinutes(stat.timespent);
                            count[4]++;
                            break;

                        case 'lists':
                            time[3] += this.toMinutes(stat.timespent);
                            count[3]++;
                            break;

                        case 'loops':
                            time[2] += this.toMinutes(stat.timespent);
                            count[2]++;
                            break;
                        default:
                            break;
                    }
                });
            }
        }

        for (let i = 0; i < time.length; i++) {
            areaWiseAvgTime[i] = time[i] / count[i];
            areaWiseAvgTime[i] = Math.abs(areaWiseAvgTime[i] = time[i]);
        }

        return areaWiseAvgTime;
    }

    private getAreaWiseCompilations(): Array<number> {
        let compilations: Array<number> = [];

        for (let index = 0; index < 5; index++) {
            compilations[index] = 0;
        }

        // Read assignment stats
        let statsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

        if (fs.existsSync(statsPath)) {
            let assignmentStats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

            // Always true
            if (Array.isArray(assignmentStats)) {
                // Read scores for each assignment
                assignmentStats.forEach(stat => {
                    switch (stat.area) {
                        case 'basics':
                            compilations[0] += stat.numberOfCompilations;
                            break;
                        case 'conditionals':
                            compilations[1] += stat.numberOfCompilations;
                            break;

                        case 'functions':
                            compilations[4] += stat.numberOfCompilations;
                            break;

                        case 'lists':
                            compilations[3] += stat.numberOfCompilations;
                            break;

                        case 'loops':
                            compilations[2] += stat.numberOfCompilations;
                            break;
                        default:
                            break;
                    }
                });
            }
        }

        return compilations;
    }

    private getAreaWiseErrors() {
        let errors: Array<number> = [];

        for (let index = 0; index < 5; index++) {
            errors[index] = 0;
        }

        // Read assignment stats
        let statsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

        if (fs.existsSync(statsPath)) {
            let assignmentStats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

            // Always true
            if (Array.isArray(assignmentStats)) {
                // Read scores for each assignment
                assignmentStats.forEach(stat => {
                    switch (stat.area) {
                        case 'basics':
                            errors[0] += stat.numberOfErrors;
                            break;
                        case 'conditionals':
                            errors[1] += stat.numberOfErrors;
                            break;

                        case 'functions':
                            errors[4] += stat.numberOfErrors;
                            break;

                        case 'lists':
                            errors[3] += stat.numberOfErrors;
                            break;

                        case 'loops':
                            errors[2] += stat.numberOfErrors;
                            break;
                        default:
                            break;
                    }
                });
            }
        }

        return errors;
    }

    private getAreaWiseTimeSpent() {
        let timeSpent: Array<number> = [];

        for (let index = 0; index < 5; index++) {
            timeSpent[index] = 0;
        }

        // Read assignment stats
        let statsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

        if (fs.existsSync(statsPath)) {
            let assignmentStats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

            // Always true
            if (Array.isArray(assignmentStats)) {
                // Read scores for each assignment
                assignmentStats.forEach(stat => {
                    switch (stat.area) {
                        case 'basics':
                            timeSpent[0] += this.toMinutes(stat.timespent);
                            break;
                        case 'conditionals':
                            timeSpent[1] += this.toMinutes(stat.timespent);
                            break;

                        case 'functions':
                            timeSpent[4] += this.toMinutes(stat.timespent);
                            break;

                        case 'lists':
                            timeSpent[3] += this.toMinutes(stat.timespent);
                            break;

                        case 'loops':
                            timeSpent[2] += this.toMinutes(stat.timespent);
                            break;
                        default:
                            break;
                    }
                });
            }
        }

        return timeSpent;
    }

    private toMinutes(timeInMilliseconds: number) {
        return timeInMilliseconds / 60000;
    }

}