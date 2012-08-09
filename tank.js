var TANK = {

	_reserved_words: ['__keys__', '__updated__', '__created__'],
	
	_event_listener: false,
	_update: true,
	
	// TODO - the __updated__

	// TODO - add an event listener that keeps track of __keys__ and __updated__


	init: function() {
		if (window.addEventListener) {
		  window.addEventListener("storage", function() { this._handle_storage() }, false);
		} else {
		  window.attachEvent("onstorage", this._handle_storage);
		};
		this._event_listener = false;
		// now add a temporary item
		var temp = 'TANK' + new Date().getTime();
		localStorage.setItem(temp, "true");
		// did the eventlistener fire? set the var accordingly
		if (this._event_listener) this._update = false;
		// remove the temporary item
		localStorage.removeItem(temp)
	},
	
	_handle_storage: function(e) {
		/*
		function that fires when the localStorage object is changed
		keeps track of the keys in play plus their updated and creted dates.
		the eventObject has the following keys:
		newValue
		oldValue
		key
		at the time of writing: Jun 2012, not all broewsers support this event, and some only fire it when 
		localStorage methods are called in other incstances of the browser window.
		So we can't rely on this function - but it's there for the future :)
		*/
		// update the __keys__
		this.event_listener = true;
		var keys = this.getKeys();
		if ((keys.indexOf(e.key) === -1) && e.newValue) {
			keys.push(e.key);
		}
		// updated the __updated__
		if (e.newValue) {
			this._updated__(e.key)
		}
		// updated the __created__
		if (!e.oldValue && e.newValue) {
			this._created__(e.key)
		}
		// if this is a delete, remove the date from __keys__, __updated__ and __created__
		if (!e.newValue) {
			this.removeItem(e.key);
		}
	},

	_updated: function(key) {
		
	},

	_created: function(key) {
		
	},

	setItem: function(key, value) {
		/*
		setItem - either a single key, value or an objecy of key-value pairs
		*/
		// update multiple values by passing an object of key-value pairs
		var output_list = [],
			args = arguments;
		if ((args.length === 1) && (typeof args[0] === 'object')) {
			for (var submission in args[0]) {
				output_list.push(this._processItem(submission, args[0][submission]));
			}
			return output_list
		}
		// update a single value
		else if ((args.length === 2) && (typeof args[0] === 'string')) {
			return this._processItem(args[0], args[1])
		}
	},

	getItem: function (key, defaultVal) {
		/*
		returns a key value
		second value can be a default value
		*/
		var value = (defaultVal) ? defaultVal : "";
		var storedVal = localStorage.getItem(key);
		return (storedVal) ? storedVal : value;
	},

	getItems: function () {
		/*
		retrieve multiple key values in a single call.
		function that takes multiple arguments
		returns an object with values as attributes
		*/
		var args = arguments,
			len = args.length,
			returnObj = {};
		for (var i=0; i<len ; i++) {
			returnObj[args[i]] = localStorage.getItem(args[i]);
		}
		return returnObj;
	},

	getAllItems: function () {
		/*
		retrieve multiple key values in a single call.
		function that takes multiple arguments
		returns an object with values as attributes
		*/
		var args = this.getKeys(),
			len = args.length,
			returnObj = {};
		for (var i=0; i<len ; i++) {
			returnObj[args[i]] = localStorage.getItem(args[i]);
		}
		return returnObj;
	},

	removeItem: function(key) {
		var keyval = localStorage.getItem(key);
		if (keyval) {
			localStorage.removeItem(key);
			return keyval;
		}
		return false;
	},
	
	clear: function() {
		localStorage.clear();
		return true;
	},

	_processItem: function(key, value) {
		/*
		update a single key-value pair
		*/
		// validate input first
		if (this._reserved_words.indexOf(this.__keys__) !== -1) return store.returnObj({ 'success': false, 'msg': key + " is a reserved keyword"});
		if (key.indexOf(",") !== -1) return store.returnObj({'success': false, 'msg': "The comma char is not allowed in the key value"});
		var keys = localStorage.getItem('__keys__'),
			mode = "create";
		if (keys) {
			keys = keys.split(",");
			// if we're overwriting data, no need to add the key
			if (keys.indexOf(key) === -1) keys.push(key);
			else mode = 'update';
		}
		else {
			keys = [key];
		}
		localStorage.setItem(key, value);
		localStorage.setItem('__keys__', keys.toString());
		return {
			'key': key,
			'value': value.toString(),
			'mode': mode
		};
	},

	getKeys: function() {
		/*
		returns a list of the keys that have been updated
		*/
		var keys = localStorage.getItem('__keys__');
		if (keys) return keys.split(',')
		return [];
	}
};
TANK.init();