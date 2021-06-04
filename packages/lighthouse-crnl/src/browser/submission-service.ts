import Store = require("electron-store");
const homedir = require('os').homedir();
import * as fs from "fs";
import path = require('path');

export class SubmissionService {
    private readonly store = new Store();

    public processAssignmentSubmission(): number {
        let score: number = 0;

        console.info('Processing assignment submission info');

        let submissionOutput = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', `${this.store.get('assignmentName')}`, 'testing.log');

        if (fs.existsSync(submissionOutput)) {
            let testLog = fs.readFileSync(submissionOutput, 'utf-8');

            console.info(testLog);

            if (testLog.includes('OK')) {
                // Test cases passed
                score = 10;

                this.updateAssignmentsStats(score);
            } else {
                let numberOfTestCases = testLog.split('Ran ')[1].split(' ')[0]

                console.info(`Number of test cases: ${numberOfTestCases}`);

                let numberOfFailures = testLog.split('failures=')[1].split(')')[0]

                console.info(`Number of failed test cases: ${numberOfFailures}`);

                // Use the number of failures to evaluate the score
                let negation = 10 / parseInt(numberOfFailures);
                score = 10;
                for (let i = 0; i < parseInt(numberOfTestCases); i++) {
                    score -= negation
                }
            }
        }

        // Delete the test log
        fs.unlinkSync(submissionOutput);

        return score;
    }

    public getSubmissionMessage(score: number): string {
        let message = '';

        if (score == 10) {
            message = '🎉🎊🥳 Amazing you just submitted your assignment with flying colours! 🎉🎊🥳'
        } else if (score >= 7) {
            message = 'Good job, assignment submitted, do take time to see if you can improve!'
        } else if (score >= 5) {
            message = 'Hard work pays off, you submitted the assignment but I recommend that you revise your concepts'
        } else {
            message = 'I know you can do it, remember, if you fail once, try try again... 😊'
        }

        return message;
    }

    private updateAssignmentsStats(score: number): void {
        let statsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

        let id = this.store.get('assignmentId');

        if (id && fs.existsSync(statsPath)) {
            let stats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

            if (Array.isArray(stats)) {
                stats.forEach(stat => {
                    if (stat.id == id) {
                        stat.score = score;

                        if (score >= 5)
                            stat.completed = true;
                    }
                })
            }

            fs.writeFile(statsPath, JSON.stringify(stats), (err) => { if (err) console.error(err); });
        }
    }
}