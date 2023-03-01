import faunadb from 'faunadb';
import dotenv from 'dotenv';
dotenv.config().parsed;

const q = faunadb.query;


export const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

const createChatCollectionIfNotExists = async () => {
    try {
        await client.query(
            q.CreateCollection({ name: 'chats' })
        );
    } catch (e) {
        if (e.message === 'instance already exists') {
            console.log('Collection already exists');
        } else {
            console.log(e);
        }
    }
}

const createUsersCollectionIfNotExists = async () => {
    try {
        await client.query(
            q.CreateCollection({ name: 'users' })
        );
    } catch (e) {
        if (e.message === 'instance already exists') {
            console.log('Collection already exists');
        } else {
            console.log(e);
        }
    }
}

const createIndexByUserIfNotExists = async () => {
    try {
        await client.query(
            q.CreateIndex({
                name: 'users_by_sub',
                source: q.Collection('users'),
                terms: [{ field: ['data', 'sub'] }]
            })
        );
    } catch (e) {
        if (e.message === 'instance already exists') {
            console.log('Index already exists');
        } else {
            console.log(e);
        }
    }
}

const createIndexByChatIfNotExists = async () => {
    try {
        await client.query(
            q.CreateIndex({
                name: 'chats_by_user',
                source: q.Collection('chats'),
                terms: [{ field: ['data', 'user'] }]
            })
        );
    } catch (e) {
        if (e.message === 'instance already exists') {
            console.log('Index already exists');
        } else {
            console.log(e);
        }
    }
}

export const bootstrap = async () => {
    await createChatCollectionIfNotExists();
    await createUsersCollectionIfNotExists();
    await createIndexByUserIfNotExists();
    await createIndexByChatIfNotExists();
}