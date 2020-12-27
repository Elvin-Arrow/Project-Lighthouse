
export class Model {
    ID: Number;
    UserID: Number;
    Error: string;
    Category: string;
    Language: string;
    CompileCount: Number;


    constructor(parsedJson: any) {
        this.ID = parsedJson['ID'];
        this.UserID = parsedJson['UserID'];
        this.Error = parsedJson['Error'];
        this.Category = parsedJson['Category'];
        this.Language = parsedJson['Language'];
        this.CompileCount = parsedJson['CompileCount'];
    }

}
