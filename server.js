const express = require('express')
const app = express()

var bodyParser = require('body-parser'); // Body-parser -- a library that provides functions for parsing incoming requests
app.use(bodyParser.json());              // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
const axios = require('axios');
const qs = require('query-string');





app.use(bodyParser.json())


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}))


//Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))


//create database connect
var pgp = require('pg-promise')();


//LOCAL DATABASE -------------------------- (UNCOMMENT THIS CODE FOR IT TO WORK!!!!!!!!)

// const dbConfig = {
//     host: 'localhost',
//     port: 5432,
//     database: 'databasename',
//     user: 'databaseuser',
//     password: 'databasepassword'
// };

// var db = pgp(dbConfig)

// port = 3000

// app.listen(port, () => console.info(`Listening on port ${port}`)) //console info is so we can see in console



//HEROKU DATABASE -------------------------

const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user:  process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};

const isProduction = process.env.NODE_ENV === 'production';
dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;



if (isProduction) {
    pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

const db = pgp(dbConfig);




const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Express running → PORT ${server.address().port}`);
});


//Set Views
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/'));

//to display main.ejs
app.get('', (req, res) => {
    
    // res.json({ status: "success", message: "FirstGet!" });

    res.render('pages/main', {
        my_title: "Main Search",
        items: '',
        error: false,
        message: ''
      });
})

app.get('/reviews', (req, res) => {
    //res.send() <- this can just send a string instead of a file
    //res.sendFile(__dirname + '/views/index.html')

    // res.json({ status: "success", message: "SecondGet!" });

    db.any('SELECT * FROM reviews')
            .then(function (rows) {
                res.render('pages/reviews', {
                    my_title: "Review pages",
                    data: rows,
                    
                })
            })

            .catch(function (err) {
                console.log("ERROR")
                res.render('pages/reviews', {
                    my_title: 'Review page',
                    data: '',
                   
                    
                })
            })
    
    

    
})


app.post('/reviews', function(req, res) {

    var reviewInput = req.body.reviewInput
    
    var mealName = (req.body.mealName).toLowerCase()

    var mealId = req.body.mealID

    console.log(reviewInput)

    console.log(mealName)

    console.log(mealId)

    
    if(reviewInput)
    {

        // var insert_statement = 'INSERT INTO reviews(id, meal_name, review) VALUES('+mealId+', '+mealName+', '+reviewInput+');'


        

        db.query('INSERT INTO reviews(id, meal_name, review, review_date) VALUES($1,$2,$3,current_timestamp);',[mealId, mealName, reviewInput])
        
        
        db.any('SELECT * FROM reviews')
            .then(function (rows) {
                res.render('pages/reviews', {
                    my_title: "Review pages",
                    data: rows,
                    
                })
            })

            .catch(function (err) {
                console.log("ERROR")
                res.render('pages/reviews', {
                    my_title: 'Review page',
                    data: '',
                   
                    
                })
            })
    

        
    }
  
    

    

})

app.post('/review_results', function(req, res) {
    var reviewsearchInput = (req.body.reviewSearchInput).toLowerCase()

    

    if(reviewsearchInput)

    {

        

        db.any('SELECT * FROM reviews WHERE meal_name = $1', [reviewsearchInput])
            .then(function (rows) {
                res.render('pages/reviews', {
                    my_title: "Review pages",
                    data: rows,
                    
                })
            })

            .catch(function (err) {
                console.log("ERROR")
                res.render('pages/reviews', {
                    my_title: 'Main page',
                    data: '',
                   
                    
                })
            })



    }

    




    




})



app.post('/results', function(req, res) {
    
    var searchInput = req.body.searchInput
    

    //.then(({data})

    if(searchInput) {
        
        axios({
            url: `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`,
            method: 'GET',
            dataType:'json',
        })
            .then(items => {
                // console.log(searchInput)
                // console.log(items)
                // console.log('-------------------------------------------------------------------------------')
                // console.log(items.data)
                // console.log('-------------------------------------------------------------------------------')
                // console.log(items.data.meals)
                // console.log('-------------------------------------------------------------------------------')
                // console.log(items.data.meals[0])
                // console.log('-------------------------------------------------------------------------------')
                // console.log(items.data.meals[0].strMeal)

                // console.log(items.data.meals[0])

                
                
                if(items.data.meals != null)
                {
                    res.render('pages/main', {
                        my_title: "Search Results",
                        items: items,
                        message:"",
                        error: false
    
                        
                        
    
    
                    }
    
    
                    )
                    
                }
                else
                {
                    res.render('pages/error', {
                        my_title: "Error page"
                    })
                }
                
                
                // console.log(items.data.results)
                console.log("It worked")
            
            })
            .catch(error => {
                console.log(error)
                console.log(error);
                res.render('pages/main',{
                    my_title: "Search Results",
                    items: '',
                    error: true,
                    message: error
                })
            
            });


    }




});


// Listen on port 3000




