const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

let app = express()

const { Pool } = require('pg');
let pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://postgres:DilPG@localhost/rectangles",
    ssl: {
        rejectUnauthorized: false
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {

    try {
        const results = await pool.query(`SELECT * FROM rectangles`)
        const data = {results: results.rows}
        res.render('pages/index', data)
    } catch (error) {
        res.send(error)
    }

})

app.post('/create', async (req, res) => {

    try {
        const data = req.body
        await pool.query(
            `
            INSERT INTO rectangles (name, color, width, height)
            VALUES ('${data.name}', '${data.color}', ${data.width}, ${data.height})
            `
        )
        res.redirect('/')
    } catch (error) {
        res.send(error)
    }

})

app.get('/info/:id', async (req, res) => {

    try {
        const result = await pool.query(`SELECT * FROM rectangles WHERE id = ${req.params.id}`)
        const data = {result: result.rows[0]}
        res.render('pages/info', data)
    } catch (error) {
        res.send(error)
    }

})

app.post('/update/:id', async (req, res) => {

    try {
        const data = req.body
        await pool.query(
            `
            UPDATE rectangles
            SET name = '${data.name}', color = '${data.color}', width = ${data.width}, height = ${data.height}
            WHERE id = ${req.params.id}
            `
        )
        res.redirect(`/info/${req.params.id}`)
    } catch (error) {
        res.send(error)
    }

})


app.listen(PORT, () => console.log(`Listening on ${PORT}`))