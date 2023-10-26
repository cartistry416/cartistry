
import mongoose, { Document, Model, Schema, Types } from 'mongoose';

const UserSchema = new Schema<UserDocument>({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    posts: [{ type: Types.ObjectId, ref: 'Post', default: [] }],
    mapsMetdadata: [{ type: Types.ObjectId, ref: 'MapMetadata', default: [] }],
    likedPosts: [{ type: Types.ObjectId, ref: 'Post', default: [] }],
    untitledCount: { type: Number, default: 0 },
    duplicateCount: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
    timeOfLastPasswordResetRequest: { type: Date },
  }, { timestamps: true });

interface UserDocument extends Document {
    userName: string;
    email: string;
    passwordHash: string;
    posts: Types.ObjectId[];
    mapsMetdadata: Types.ObjectId[];
    likedPosts: Types.ObjectId[];
    untitledCount: number;
    duplicateCount: number;
    isAdmin: boolean;
    timeOfLastPasswordResetRequest: Date;
  }
  
const UserModel: Model<UserDocument> = mongoose.model('User', UserSchema);

export { UserModel, UserDocument };