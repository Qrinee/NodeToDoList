const express = require('express')
const mysql = require('mysql')
const router = express.Router();
const {authPermissions} = require('./middlewares')

const app = express()
const port = process.env.PORT || 5000

app.use(express.urlencoded({extended: true}))

app.use(express.json())

app.use(express.static('public'))

const pool = mysql.createPool(
    {
        connectionLimit : 10,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'todolist'
    }
)

app.get('/categories', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * FROM categories', (err, rows) => {
            connection.release()

            !err ? res.send(rows) : console.log(err)

        })
    })
})

// Rename task
app.put('/rename/:task_id', (req, res) => {
    const taskId = req.params.task_id;
    const newTaskName = req.body.taskname;

    if (!taskId || !newTaskName) {
        res.status(400).json({ error: 'Brak wymaganych danych.' });
        return;
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Błąd połączenia z bazą danych:', err);
            res.status(500).json({ error: 'Błąd serwera.' });
            return;
        }

        connection.query(
            'UPDATE tasks SET taskname = ? WHERE id_tasks = ?',
            [newTaskName, taskId],
            (err, results) => {
                connection.release();

                if (err) {
                    console.error('Błąd podczas aktualizacji zadania:', err);
                    res.status(500).json({ error: 'Błąd serwera.' });
                    return;
                }

                if (results.affectedRows === 0) {
                    res.status(404).json({ error: 'Nie znaleziono zadania o podanym ID.' });
                } else {
                    res.status(200).json({ message: 'Zaktualizowano nazwę zadania.' });
                }
            }
        );
    });
});

// Add new task
app.post('/add-task', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err

        const params = req.body

        connection.query('INSERT INTO tasks SET ?', params, (err) => {
            connection.release()
            !err ? res.send(`Task with the Record ID: ${params.id} has been added`) : console.log(err)

        })
    })
})

// Add new category
app.post('/add-category', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err

        const params = req.body

        connection.query('INSERT INTO categories SET ?', params, (err) => {
            connection.release()

            !err ? res.send(`Category with the Record ID: ${params.id} has been added`) : console.log(err)

        })
    })
})

// Change checkbox value
app.put('/change-checkbox-value', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const params = req.body;
        const taskId = params.id; 

        const isCompleted = params.iscompleted;

        connection.query('UPDATE tasks SET iscompleted = ? WHERE id_tasks = ?', [isCompleted, taskId], (err, results) => {
            connection.release();

            if (!err) {
                res.send(`Task with ID ${taskId} has been updated. New iscompleted value: ${isCompleted}`);
            } else {
                console.log(err);
                res.status(500).send('An error occurred while updating the task.');
            }
        });
    });
});

// Delete category
app.delete('/delete-category', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        
        const params = req.body

        connection.query('DELETE FROM categories WHERE id_categories = ?', params.id_categories, (err) => {
            connection.release()

            !err ? res.send(`Category with the record ID: ${[req.params.id]} has been removed.`) : console.log(err)

        })
    })
})

// Delete task
app.delete('/delete-task/:task_id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        
        const taskId = req.params.task_id;

        connection.query('DELETE FROM tasks WHERE id_tasks = ?', taskId, (err) => {
            connection.release()

            if (!err) {
                res.send(`Task with the record ID: ${taskId} has been removed.`)
            } else {
                console.log(err)
                res.status(500).send('Błąd podczas usuwania zadania.')
            }
        });
    });
});

// Get tasks
app.get('/user/:id_users', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query('SELECT * FROM tasks WHERE id_users = ?', [req.params.id_users], (err, rows) => {
            connection.release() // return the connection to pool

            !err ? res.send(rows) : console.log(err)

        })
    })
})

// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listen on port ${port}`))