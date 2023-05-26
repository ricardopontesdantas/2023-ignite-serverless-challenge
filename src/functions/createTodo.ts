import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import crypto from "crypto";

interface ICreateTodo {
    userId: string,
    title: string,
    deadline: Date
}

interface ITodo {
    id: string,
    user_id: string,
    title: string,
    done: boolean,
    deadline: Date
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const { userId } = event.pathParameters;
    const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
    const data: ITodo = {
        id: crypto.randomUUID(),
        user_id: userId,
        title,
        done: false,
        deadline: new Date(deadline),
    }
    const s3 = new S3();
    await s3.putObject({
        Bucket: "todos",
        Key: userId,
        ACL: "public-read",
        Body: data,
        ContentType: "application/json"
    }).promise();
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Todo created successfully",
            data
        })
    }
}