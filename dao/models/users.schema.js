import mongoose from 'mongoose';

const usersCollection = "githubUsers";
const UsersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
    },
    role: {
        type: String,
        default: "User"
    }
});

const UsersModel = mongoose.model(usersCollection,UsersSchema);
export default UsersModel;