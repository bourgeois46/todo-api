import mongoose from "mongoose";

// new -> 새로운 스키마를 만든다.
const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxLength: 30,
            validate: {
                validator: function (title) {
                    return title.split(' ').length > 1;
                },
                message: 'Must contain at least 2 words.',
            },
        },
        description: {
            type: String,
        },
        isComplete: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true, // mongoose가 알아서 createdAt, updatedAt을 설정
    },
);

// schma가 틀이라면, model은 이를 기반으로 해서 객체를 생성, 조회, 수정 삭제하는 인터페이스
const Task = mongoose.model('Task', TaskSchema); // Task : 컬렉션 이름 

export default Task;