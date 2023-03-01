
import express from 'express';
import fetch from 'node-fetch';
import faunadb from 'faunadb';
import { client, bootstrap } from './bootstrap.js'

const url = "https://api.openai.com/v1/completions"


const q = faunadb.query;



const fetchAuth0UserInfo = async (accessToken) => {
    const options = {
        method: 'GET',
        headers: {
                'Authorization': `Bearer ${accessToken}`
        }
    }
    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, options);
    const data = await response.json();
    return data;
}

const createChat = async (user, text, response) => {
    try {
        await client.query(
            q.Create(q.Collection('chats'), {
                data: {
                    user,
                    text,
                    response
                }
            })
        );
    } catch (e) {
        console.log(e);
    }
}

const upsertUser = async (user) => {
    try {
        await client.query(
            q.If(
                q.Exists(q.Match(q.Index('users_by_sub'), user.sub)),
                q.Update(q.Select(['ref'], q.Get(q.Match(q.Index('users_by_sub'), user.sub))), { data: user }),
                q.Create(q.Collection('users'), { data: user })
            )
        );
    } catch (e) {
        console.log(e);
    }
}


const getCompletion = async(text, tokens) => {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: text,
            max_tokens: tokens,
            temperature: 0.9
        })
    }
    const response = await fetch(url, options);
    const data = await response.json();
    return data
}

const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    console.log(req)
    res.json({ message: 'ChatGPT' });
});



app.get('/completion', async (req, res) => {
    const { q, tokens, sub } = req.query;
    const data = await getCompletion(q, Number(tokens));
    await createChat(sub, q, data)
    res.send(data.choices[0].text.replace(/(\r\n|\n|\r)/gm, ""));
});

app.get('/auth', async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1]
    const userInfo = await fetchAuth0UserInfo(accessToken);
    await upsertUser(userInfo);
    res.send(JSON.stringify(userInfo));
});






app.listen(5555, () => {
    console.log('Server listening on port 5555');
    bootstrap();
    console.log('Collections and indexes created');
});