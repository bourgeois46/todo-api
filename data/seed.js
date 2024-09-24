import mongoose from "mongoose";
import data from './mock.js';
import Task from '../models/Tasks.js';
import * as dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.DATABASE_URL); // MongoDB 서버에 연결 & 데이터베이스를 초기데이터로 리셋

// model.(연산 이름)
await Task.deleteMany({}); // Task 컬렉션에 있는 모든 데이터 삭제
await Task.insertMany(data); // mock.js에서 가져온 데이터를 Task 컬렉션에 삽입

mongoose.connection.close(); // 데이터베이스 연결 종료



