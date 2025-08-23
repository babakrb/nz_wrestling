const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const multer = require('multer');
//const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Save path
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save original file name
  }
});

const upload = multer({ storage });


const fs = require('fs');


const allowedOrigins = ['https://your-frontend-domain.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));



//app.use(cors({ origin: `${process.env.REACT_APP_FRONTEND_URL}`, credentials: true }));
//console.log('Frontend Origin:', process.env.REACT_APP_FRONTEND_URL);

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));




mongoose.connect(process.env.MONGO_URI)
 .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);


const CompetitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: String,
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming',
  },
  style: {
    type: [String], // ✅ اضافه شد: آرایه‌ای از رشته‌ها
    enum: ['freestyle', 'greco-roman'],
    default: [],
  },
adds: { type: String }, // ✅ اضافه شد: نام فایل ADDS
});

CompetitionSchema.index({ title: 1, date: 1 }, { unique: true });

const Competition = mongoose.model('Competition', CompetitionSchema);

const BracketSchema = new mongoose.Schema({
  competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bracket', required: true },
  mat: String,
  category: String,
  round: String,
  match: Number,
  wrestler1: String,
  wrestler2: String,
  time: String,
    date: Date,
  winner: String,
  winMethod: {
		type: String,
		enum: ['Technical Fall','Decision','Default','Disqualification','Injury'],
	      },
  score: String,
  wrt1Point: Number,
  wrt2Point: Number,
});

const Bracket = mongoose.model('Brackets', BracketSchema);


const secret = 'myjwtsecret';

let isAuthenticated = false;

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
                   res.status(401).json({ success: false});    
  } 
  const token = jwt.sign({ email: user.email }, secret, { expiresIn: '1h' });
  res.json({ success: true, token });	
});

app.get('/api/dashboard', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json({ message: 'Welcome to the dashboard', user });
  });
});

app.get('/api/competitions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // استخراج فیلترها
    const { title, date, location, status, style } = req.query;

    const filter = {};

    if (title) {
      filter.title = { $regex: new RegExp(title, 'i') };
    }

    if (date) {
      const selectedDate = new Date(date);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);
      filter.date = { $gte: selectedDate, $lt: nextDate };
    }

    if (location) {
      filter.location = { $regex: new RegExp(location, 'i') };
    }

    if (status) {
      filter.status = status;
    }

    if (style) {
      filter.style = style; // یا { $in: [style] } برای بررسی وجود
    }

    const totalCompetitions = await Competition.countDocuments(filter);
    const competitions = await Competition.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    res.json({
      page,
      totalPages: Math.ceil(totalCompetitions / limit),
      totalCompetitions,
      competitions
    });
  } catch (err) {
    console.error('Error fetching competitions with filters:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/brackets', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const { wrestler, mat, category, competitionId } = req.query;

    const filter = {};

    if (wrestler) {
      filter.$or = [
        { wrestler1: { $regex: new RegExp(wrestler, 'i') } },
        { wrestler2: { $regex: new RegExp(wrestler, 'i') } }
      ];
    }

    if (mat) {
      filter.mat = { $regex: new RegExp(mat, 'i') };
    }

    if (category) {
      filter.category = { $regex: new RegExp(category, 'i') };
    }

    if (competitionId) {
      filter.competitionId = competitionId;
    }

    const totalBrackets = await Bracket.countDocuments(filter);
    const brackets = await Bracket.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ time: 1 });

    res.json({
      bracket: brackets,
      totalPages: Math.ceil(totalBrackets / limit),
      totalBrackets,
      page
    });

  } catch (err) {
    console.error('Error fetching brackets with filters:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/competitions/:id', async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }
    res.json(competition);
  } catch (error) {
    console.error('Error fetching competition:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// EXPORT route
app.get('/api/brackets/export/:competitionId', async (req, res) => {
  try {
    const brackets = await Bracket.find({ competitionId: req.params.competitionId });
    res.json(brackets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export brackets' });
  }
});

// IMPORT route
app.post('/api/brackets/import/:competitionId', async (req, res) => {
  try {
    const data = req.body; // از فرانت اطلاعات JSON می‌آید
    const competitionId = req.params.competitionId;


    await Bracket.deleteMany({ competitionId });

    const brackets = data.map((item) => ({
      ...item,
      competitionId
    }));

    await Bracket.insertMany(brackets);
    res.status(200).json({ message: 'Brackets imported successfully' });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import brackets' });
  }
});


// POST /api/competitions
app.post('/api/competitions', upload.single('file'), async (req, res) => {
  try {
    const { title, date, location, status, style} = req.body;

    const newComp = new Competition({
      title,
      date: new Date(date),
      location,
      status,
      style: JSON.parse(style), // چون رشته JSON فرستاده می‌شود
    });

    if (req.file) {
      newComp.adds = req.file.originalname; // ✅ ذخیره نام اصلی فایل
    }

    await newComp.save();
    res.status(201).json({ success: true, message: 'Competition created' });
  } catch (err) {
    console.error('Error saving competition:', err);
    if (err.code === 11000) {
      res.status(409).json({ success: false, message: 'Duplicate title and date' });
    } else {
      res.status(500).json({ success: false, message: 'Error saving competition' });
    }
  }
});


// GET یک براکت خاص
app.get('/api/brackets/:id', async (req, res) => {
  try {
    const bracket = await Bracket.findById(req.params.id);
    if (!bracket) return res.status(404).json({ error: 'Bracket not found' });
    res.json(bracket);
  } catch (error) {
    console.error('Error fetching bracket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT ویرایش یک براکت خاص
app.put('/api/brackets/:id', async (req, res) => {
  try {
    const updatedBracket = await Bracket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBracket) return res.status(404).json({ error: 'Bracket not found' });
    res.json({ message: 'Bracket updated successfully', updatedBracket });
  } catch (error) {
    console.error('Error updating bracket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/api/brackets/:id', async (req, res) => {
  try {
    const result = await Bracket.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Bracket not found' });
    }
    res.json({ message: 'Bracket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bracket' });
  }
});

//const path = require('path');

// ویرایش مسابقه
app.put('/api/competitions/:id', upload.single('file'), async (req, res) => {
  try {
    const { title, date, location, style } = req.body;

    const updatedFields = {
      title,
      date: new Date(date),
      location,
      style: JSON.parse(style), // چون از کلاینت به‌صورت رشته JSON فرستاده می‌شود
    };

    // اگر فایل آپلود شده باشد، می‌توانید مسیر آن را ذخیره کنید
    if (req.file) {
                    updatedFields.adds = req.file.originalname; // یا originalname بسته به نیازتان
                  }


    const updated = await Competition.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Competition not found' });
    }

    res.json({ message: 'Competition updated successfully', competition: updated });
  } catch (error) {
    console.error('Error updating competition:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/competitions/:id', async (req, res) => {
  try {
    const competition = await Competition.findByIdAndDelete(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }

    // اگر فایلی برای competition ثبت شده باشد، آن را هم حذف کن
    const fs = require('fs');
    const path = require('path');
    if (competition.adds) {
      const filePath = path.join(__dirname, 'uploads', competition.adds);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

await Bracket.deleteMany({ competitionId: req.params.id });

    res.status(200).json({ message: 'Competition deleted successfully' });
  } catch (error) {
    console.error('Error deleting competition:', error);
    res.status(500).json({ message: 'Failed to delete competition' });
  }
});


app.post('/api/brackets', async (req, res) => {
  try {
    const bracket = new Bracket(req.body);
    await bracket.save();
    res.status(201).json(bracket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// مسیر POST برای ثبت‌نام کاربر
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // بررسی اینکه ایمیل قبلاً ثبت نشده باشد
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // هش کردن پسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // ساخت و ذخیره کاربر جدید
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // ساخت توکن JWT
    const token = jwt.sign({ email: newUser.email }, secret, { expiresIn: '1h' });

    res.status(201).json({ success: true, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Simple test API
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});


app.listen(PORT, () => console.log(`Server is running on :${process.env.REACT_APP_BACKEND_URL}`));
