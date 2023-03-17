import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profileUrl: {
        type: String,
        required: true,
    },
});

const User = mongoose.models.userSchema || mongoose.model('User', userSchema);

export default User;
