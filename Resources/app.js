var sqlApp = {}; // app's namespace

//create DB on first run
var db = Ti.Database.open('testDB');
db.execute('CREATE TABLE IF NOT EXISTS runners (id INTEGER PRIMARY KEY, name VARCHAR(24) NOT NULL, pace VARCHAR(6) NOT NULL)');
db.close();

sqlApp.addData = function () {
	//open the database, write a row or two
var db = Ti.Database.open('testDB');
db.execute('CREATE TABLE IF NOT EXISTS runners (id INTEGER PRIMARY KEY, name VARCHAR(24) NOT NULL, pace VARCHAR(6) NOT NULL)');

db.execute('INSERT INTO runners (name,pace) VALUES (?,?)',"Mike Ory","08:00");
db.execute('INSERT INTO runners (name,pace) VALUES (?,?)',"Brenda Hurley","08:00");
db.close();
};


sqlApp.thisIsATest = function(temp) {
	if(temp.length < 4) {
		return "0" + temp
	} else {
		return temp ;
	}
};



sqlApp.getRows = function() {
	var db = Ti.Database.open('testDB');
	var data = [];
	var rs = db.execute('SELECT id, name, pace FROM runners ORDER BY name');
	while(rs.isValidRow()) {
		var tblRow = Ti.UI.createTableViewRow({
			minRowHeight:40
		});
		/*tblRow.add(Ti.UI.createImageView({
			image:'http://www.worldweather.org/img_cartoon/'+rs.fieldByName('icon'),
			width:35,
			height:35,
			left:2,
			top:2
		}));*/
		tblRow.add(Ti.UI.createLabel({
			text:rs.fieldByName('id'),
			left:2,
			top:2
		}));
		tblRow.add(Ti.UI.createLabel({
			text: rs.fieldByName('name'),
			font:{
				fontWeight:'bold',
				fontSize:20
			},
			color:'black',
			left:40,
			top:2
		}));
		tblRow.add(Ti.UI.createLabel({
			text: sqlApp.thisIsATest(rs.fieldByName('pace')),
			font:{
				fontSize:15
			},
			color:'black',
			right:2,
			top:2,
			width:50
		}));
		data.push(tblRow);
		Ti.API.info('row added');
		rs.next();
	}
	db.close();
	return data;
};

/*
 * createWindowTable() creates the window that contains our weather table
 */
sqlApp.createWindowTable = function(){
	var win = Ti.UI.createWindow({
		title: 'The Database',
		backgroundColor:'white'
	});
	var table = Ti.UI.createTableView();
	// define, then call a function to populate our weather table
	function populate(){
		table.setData(sqlApp.getRows());
	}
	populate();
	// add an event listener to repopulate our table when the units preferences are changed
	Ti.App.addEventListener('app:DataAdded', populate);
	win.add(table);
	return win;
};

sqlApp.createWindowAdd = function(){
	var win = Ti.UI.createWindow({
		title: 'Add data',
		backgroundColor:'white'
	});
	var addButton = Ti.UI.createButton({
		title:'Add',
		width:200,
		height:30,
		top:200,
		left:60,	
		font:{
			fontSize:20,
			fontWeight:'bold'
		},
		textAlign:'center'
	});
	win.add(addButton);
	addButton.addEventListener('click',function(){
		sqlApp.addData();
		Ti.App.fireEvent('app:DataAdded'); //fire event to call the populate custom event listener
		alert('Data Added!');
	});
	return win;
};



/*
 * Define our tab group
 */
sqlApp.createTabs = function() {
	var tabGroup = Titanium.UI.createTabGroup();
	
	tabGroup.addTab(Ti.UI.createTab({
		title:'Table',
		window:sqlApp.createWindowTable()
	}));  
	tabGroup.addTab(Ti.UI.createTab({
		title:'Add Data',
		window:sqlApp.createWindowAdd()  
	}));  
	return tabGroup;
};

sqlApp.ui = sqlApp.createTabs();
sqlApp.ui.open();
