var db = Ti.Database.open('testDB');


db.execute('CREATE TABLE IF NOT EXISTS runners (id INTEGER PRIMARY KEY, name VARCHAR(24) NOT NULL, pace VARCHAR(6) NOT NULL)');

db.execute('INSERT INTO runners (name,pace) VALUES (?,?)',"Mike Ory","08:00");
var lastID = db.lastInsertRowID; // presumes `city` has an auto-increment column
db.execute('INSERT INTO runners (id,name,pace) VALUES (?,?)',lastID+1,"Brenda Hurley","08:00");



var dbInfo = db.execute('SELECT id,name,pace FROM runners');
var name = dbInfo.fieldByName('name');
alert('the name is ' + name);
var numRows = db.execute('SELECT Count(*) FROM runners');
Ti.API.info('the db has '+ numRows.rowCount +' rows');
db.close();