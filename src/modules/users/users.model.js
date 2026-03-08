import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    const { password, _id, __v, ...rest } = obj;
    return { ...(_id && { id: _id }), ...rest };
}
const User = mongoose.model('User', userSchema);

export default User;