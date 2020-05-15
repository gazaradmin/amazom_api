const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Категорийн нэрийг оруулна уу"],
      unique: true,
      //Хоосон зай enter-ыг автоматаар цэвэрлэнэ.
      trim: true,
      maxlength: [
        50,
        "Категорийн нэрний урт дээд тал нь 50 тэмдэгт байх ёстой.",
      ],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Категорийн тайлбарыг заавал оруулах ёстой."],
      maxlength: [
        250,
        "Категорийн нэрний урт дээд тал нь 250 тэмдэгт байх ёстой.",
      ],
    },
    photo: {
      type: String,
      //   Хоосон хүсэлт ирэх юм бол DEFAULT -оор өгнө.
      default: "no-photo.jpg",
    },
    averageRating: {
      type: Number,
      min: [1, "Рэйтинг хамгийн багадаа 1 байх ёстой."],
      max: [10, "Хамгийн ихдээ 10 байх ёстой"],
    },
    averagePrice: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// virtual talbar
CategorySchema.virtual("books", {
  ref: "Book",
  // Category -ын ID
  localField: "_id",
  // books-т байгаа category
  foreignField: "category",
  justOne: false,
});

CategorySchema.pre("save", function (next) {
  // name to SLUG
  this.slug = slugify(this.name);
  this.averageRating = Math.floor(Math.random() * 10) + 1;
  this.averagePrice = Math.floor(Math.random() * 100000) + 3000;
  next();
});

CategorySchema.pre("remove", async function (next) {
  await this.model("Book").deleteMany({ category: this._id });
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
