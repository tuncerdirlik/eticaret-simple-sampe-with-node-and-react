const mongoose = require("mongoose");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uri = "mongodb://localhost:27017";

mongoose.connect(uri, {
    dbName: "eCommerceWithReactSample",
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to mongodb success");
}).catch((err) => {
    console.log(`DB connection err: ${err}`);
});

const User = mongoose.model("User", new mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean
}));

const Product = mongoose.model("Product", new mongoose.Schema({
    _id: String,
    name: String,
    categoryName: String,
    stock: Number,
    price: Number,
    imageUrl: String
}));

const Basket = mongoose.model("Basket", new mongoose.Schema({
    _id: String,
    productId: String,
    userId: String,
    count: Number,
    price: Number
}));

const Order = mongoose.model("Order", new mongoose.Schema({
    _id: String,
    productId: String,
    userId: String,
    count: Number,
    price: Number
}));

const secretKey = "some.secret.key";

const createToken = (user) => {
    const payload = {
        user: user
    };

    return jwt.sign(payload, secretKey, {
        expiresIn: "1d"
    });
}

app.post("/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = new User({
            _id: uuidv4(),
            name: name,
            email: email,
            password: password,
            isAdmin: false
        });
        await user.save();

        const token = createToken(user);

        res.json({
            user: user,
            token: token
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/auth/login", async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email: email, password: password });
        if (!user) {
            res.status(401).json({
                error: "user not found"
            });

            return;
        }

        const token = createToken(user);

        res.json({
            user: user,
            token: token
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/products", async (req, res) => {
    try {

        const products = await Product.find({}).sort({ name: 1 });
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "uploads/");
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage: storage
});

app.post("/products", upload.single("image"), async (req, res) => {
    try {

        const { name, categoryName, stock, price } = req.body;
        const product = new Product({
            _id: uuidv4(),
            name: name,
            categoryName: categoryName,
            stock: stock,
            price: price,
            imageUrl: req.file.path
        });

        await product.save();
        res.status(201).json({ message: "Ürün kaydedildi" });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.delete("/products", async (req, res) => {
    try {
        const { id } = req.body;
        await Product.findByIdAndRemove(id);

        res.status(200).json({
            "message": "Silme işlemi başarılı"
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/baskets", async (req, res) => {
    try {

        const { productId, userId, count, price } = req.body;
        let basket = new Basket({
            _id: uuidv4(),
            productId: productId,
            userId: userId,
            count: count,
            price: price
        });

        await basket.save();

        res.status(200).json({
            "message": "Ürünler sepete eklendi"
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/baskets/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const basketWithProducts = await Basket.aggregate([
            {
                $match: { userId: userId }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "products"
                }
            }
        ]);

        res.json(basketWithProducts);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.delete("/baskets/:id", async (req, res) => {
    try {

        const { id } = req.params;
        await Basket.findByIdAndRemove(id);

        res.status(200).json({
            "message": "Ürünler sepetten silindi"
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/orders", async (req, res) => {
    try {

        const { userId } = req.body;
        const baskets = await Basket.find({ userId: userId });

        baskets.forEach(async (item) => {
            let order = new Order({
                _id: uuidv4(),
                productId: item.productId,
                userId: item.userId,
                count: item.count,
                price: item.price
            });

            await order.save();
        });

        await Basket.findOneAndRemove({ userId: userId });

        res.status(201).json({
            "message": "Sipariş oluşturuldu"
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/orders/:userId", async (req, res) => {
    try {

        const { userId } = req.params;

        const orderWithProducts = await Order.aggregate([
            {
                $match: { userId: userId }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "products"
                }
            }
        ]);

        res.json(orderWithProducts);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`application is running on port: ${port}, http://localhost:${port}`);
})