const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { json } = require('express');
const { Pool } = require('pg');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(cors(cors({
    origin: 'https://remarkable-biscuit-8330af.netlify.app',
    credentials: true
})));
app.use(express.json());
app.use(cookieParser());
app.options('/login', cors());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
app.options('/login',cors())
    const verifyUser = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token) return res.json({ Error: 'You are not auth' });
    jwt.verify(token, process.env.SECRET_KEY,(err,decoded)=>{
        if(err) return res.json({ Error: 'token is not ok' });
        req.username = decoded.username
        next()
    })
};
app.get("/ver",verifyUser ,(req, res)=> {
    return res.json({Status:'success',username:req.username });
})

app.post('/register', (req, res) => {
    const sql =
        'INSERT INTO login (username, email, password, date, lastLogin, status) VALUES (?, ?, ?, ?, ?, ?)';
    const { username, email, password } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const lastLogin = date;
    const status = 'active';


    bcrypt.hash(password.toString(), 3, (err, hash) => {
        if (err) {
            console.error('Error in hashing:', err);
            return res.json({ Error: 'Error in hashing' });
        }

        const values = [username, email, hash, date, lastLogin, status];

        pool.query(sql, values, function (err, result) {
            if (err) {
                console.error('Error inserting data:', err);
                return res.json({ Error: 'Error inserting data' });
            }

            console.log('Registration successful');
            return res.json({ Status: 'success' });
        });
    });
});

app.get('/logout',(req, res) => {
    res.clearCookie('token');
    return res.json({Status: 'success'});
})

app.post('/login',cors(), (req, res) => {
    const lastLogin = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'SELECT * FROM login WHERE email = ?';
    pool.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: 'Login error in server' });
        if (data.length > 0) {
            const user = data[0];
            if (user.status === 'blocked') {
                return res.json({ Error: 'User is blocked' });
            }
            bcrypt.compare(req.body.password.toString(), user.password, (err, response) => {
                if (err) return res.json({ Error: 'Password hash error' });
                if (response) {
                    const username = user.username;
                    const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: '1d' });
                    res.cookie('token', token);
                    const updateLoginTimeSql = 'UPDATE login SET lastLogin = ? WHERE email = ?';
                    pool.query(updateLoginTimeSql, [lastLogin, req.body.email], (err, result) => {
                        if (err) return res.json({ Error: 'Error updating login time' });
                        return res.json({ Status: 'success' });
                    });
                } else {
                    return res.json({ Error: 'Invalid password' });
                }
            });
        } else {
            return res.json({ Error: 'Invalid email' });
        }
    });
});
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM login';

    pool.query(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error retrieving users from the database.' });
        } else {
            res.status(200).json(results);
        }
    });
});
app.delete('/user', (req, res) => {
    const userId = req.body.userId;

    const sql = 'DELETE FROM login WHERE id = ?';

    pool.query(sql, [userId], (err, result) => {
        if (err) return res.json({ Error: 'Error deleting user' });

        return res.json({ Status: 'success' });
    });
});
app.put('/block', (req, res) => {
    const userId = req.body.userId.id;

    const sql = 'UPDATE login SET status = ? WHERE id = ?';

    pool.query(sql, ['blocked', userId], (err, result) => {
        if (err) return res.json({ Error: 'Error blocking user' });

        return res.json({ Status: 'success' });
    });
});
app.put('/unblock', (req, res) => {
    const userId = req.body.userId.id;

    const sql = 'UPDATE login SET status = ? WHERE id = ?';

    pool.query(sql, ['active', userId], (err, result) => {
        if (err) return res.json({ Error: 'Error unblocking user' });

        return res.json({ Status: 'success' });
    });
});
app.listen(process.env.PORT || 3000, () => console.log(`listening on port 5000`));
