
export class ErrorModel {
    ID: Number;
    executionDate: string;
    type: string;
    executionStatus: boolean
    errorText: string;
    errorLine: number;
    
    constructor(parsedJson: any, index: number) {
        this.ID = index;
        this.executionDate = parsedJson['executionDate'];
        this.executionStatus = parsedJson['log']['executionStatus'];
        this.errorText = parsedJson['log']['err']['text'];
        this.errorLine = parsedJson['log']['err']['position'];
    }

}
