import DynamoDB from 'aws-sdk/clients/dynamodb';


export class CustomDynamoDB {
    tableName:string;
    identifier: string;
    DB;

    constructor(tableName: string, identifier: string) {
        this.tableName = tableName;
        this.identifier = identifier;
        this.DB = new DynamoDB({
            endpoint: 'http://localhost:4000'
        });
        console.log("Created class")
    }

    async get(id: string){
        return this.DB.query({
            KeyConditionExpression: `${this.identifier} = :id`,
            ExpressionAttributeValues: {
                ":id": {
                    S: id,
                }
            },
            TableName: this.tableName
        }).promise();
    }

    static marshall(item: any) {
        return DynamoDB.Converter.marshall(item);
    }

    static unmarshall(item: any) {
        return DynamoDB.Converter.unmarshall(item);
    }
}