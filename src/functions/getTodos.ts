import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

interface IUserTodos {
    user_id: string;
    title: string;
    done: boolean;
    deadline: Date;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const { userId } = event.pathParameters;
    const response = await document.query({
        TableName: "todos",
        KeyConditionExpression: "user_id = :userId",
        ExpressionAttributeValues: {
            ":userId": userId
        }
    }).promise();
    const userTodos = response.Items as IUserTodos[];
    if (userTodos.length > 0) {
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Valid user",
                userTodos
            })
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Invalid user"
        })
    }
}