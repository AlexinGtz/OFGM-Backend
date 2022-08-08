import DynamoDB from 'aws-sdk/clients/dynamodb';

export class CustomDynamoDB {
    tableName:string;
    identifier: string;
    DB;

    constructor(tableName: string, identifier: string) {
        this.tableName = tableName;
        this.identifier = identifier;
        this.DB = new DynamoDB({
            // endpoint: 'http://localhost:4000' // Comment if not Local
        });
    }

    async getByPrimaryKey(id: string, indexName?: string, identifier?: string, attributes?: Array<string> ){
        return this.DB.query({
            KeyConditionExpression: `${identifier ?? this.identifier} = :id`,
            ExpressionAttributeValues: {
                ":id": {
                    S: id,
                }
            },
            TableName: this.tableName,
            IndexName: indexName ?? null,
            Select: attributes ? 'SPECIFIC_ATTRIBUTES' : 'ALL_ATTRIBUTES',
            ProjectionExpression: attributes ? 
                attributes.join(',')
                : null,
        }).promise();
    }

    async getByIndex(pKName: string, 
        pKeyValue: string,
        indexName: string,
        sortKeyName?: string,
        sortKeyValue?: string,
        sortComparison?: string){
        return this.DB.query({
            KeyConditionExpression: `${pKName} = :value AND ${sortKeyName} ${sortComparison} :sort`,
            ExpressionAttributeValues: {
                ":value": {
                    S: pKeyValue,
                },
                ":sort": {
                    S: sortKeyValue
                }
            },
            TableName: this.tableName,
            IndexName: indexName,
        }).promise();
    }

    async putItem(item: any) {
        return this.DB.putItem({
            Item: CustomDynamoDB.marshall(item),
            TableName: this.tableName,
        }).promise();
    }

    static marshall(item: any) {
        return DynamoDB.Converter.marshall(item);
    }

    static unmarshall(item: any) {
        return DynamoDB.Converter.unmarshall(item);
    }
}