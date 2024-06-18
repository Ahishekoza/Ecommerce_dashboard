import mongoose, {model, models, Schema} from "mongoose";

const categorySchema = new Schema({
  name: {type:String,required:true},
  parent: {type:mongoose.Schema.Types.ObjectId, ref:'Category'},
});

export const Category = models?.Category || model('Category', categorySchema);