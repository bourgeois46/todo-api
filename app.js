import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Task from './models/Tasks.js';
import cors from 'cors';

const app = express();

const corsOptions = {
    origin: ['http://127.0.0.1:5500', 'https://my-todo.com'],
  };
  
app.use(cors(corsOptions));
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function asyncHandler(handler) {
    return async function (req, res) {
        try {
            await handler(req, res);
        } catch (e) {
            if (e.name === 'ValidationError') {
                res.status(400).send({message: e.message});
            } else if (e.name === 'CastError'){
                res.status(404).send({message: 'Cannot find given id.'});
            } else {
                res.status(500).send({message: e.message});
            }
        }
    }
}


// url 경로, 실행할 콜백 함수
app.get('/tasks', asyncHandler(async(req, res) => {
    /*
    쿼리 파라미터
    - sort : 'oldest'인 경우 오래된 테스크 기준, 나머지 경우 새로운 태스크 기준
    - count : 태스크 개수
    */

    // 1. 쿼리 실행
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0; // count 파라미터가 없거나 숫자가 아닌 경우 0

    const sortOption = { 
        createdAt: sort == 'oldest' ? 'asc' : 'desc' 
    };
    const tasks = await Task.find().sort(sortOption).limit(count); // find -> 모든 객체를 가져온다.

    /* 2. sort -> 배열 정렬
    const compareFn = 
      sort === 'oldest'
        ? (a, b) => a.createdAt - b.createdAt
        : (a, b) => b.createdAt - a.createdAt;
      
    let newTasks = mockTasks.sort(compareFn);

    // 3. count -> 배열을 잘라냄
    if (count) {
        newTasks = newTasks.slice(0, count);
    }*/

    res.send(tasks);
})); 

app.get('/tasks/:id', asyncHandler(async (req, res) => {
    const id = req.params.id; // mongoDB에서 사용하는 id는 문자열
    const task = await Task.findById(id); // 쿼리를 리턴한다

    if (task) {
        res.send(task);
    } else {
        res.status(404).send({ message: 'Cannot find given id. '});
    }
}));

app.post('/tasks', asyncHandler(async(req, res) => {
    const newTask = await Task.create(req.body);
    res.status(201).send(newTask);
}));

app.patch('/tasks/:id', asyncHandler(async(req, res) => {
    const id = req.params.id; 
    const task = await Task.findById(id); 

    if (task) {
        // 덮어쓰기
        Object.keys(req.body).forEach((key) => {
            task[key] = req.body[key];
        });
       await task.save(); // 수정한 task 저장
        res.send(task);
    } else {
        res.status(404).send({ message: 'Cannot find given id. '});
    }
}));

app.delete('/tasks/:id', asyncHandler( async(req, res) => {
    const id = Number(req.params.id);
    const task = await Task.findByIdAndDelete(id);

    if (task) {
        res.sendStatus(204);
    } else {
        res.status(404).send({ message: 'Cannot find given id. '});
    }
}));

app.get('/', (req, res) => { // 루트 경로 
    res.send('TODO API 완성!');
  });  


// 포트번호 
mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));
