/** RecordMatcher
 *
 * @description: Record Matcher System for RecordArray objects using RecordSchema objects
 * @author Francis Carelse
 * @version 0.0.1
 * @dependencies:
 * - recordarray
 * - recordschema
 */

const RecordArray = require('recordarray');
const RecordSchema = require('recordschema');

class RecordMatcher extends Array{
	/**
	 * @constructor
	 * @param {} obj (optional)
	 */
	constructor(filters) {
		// Apply the superclass
		super();

		// Initialize the store
		if(filters === undefined) return this;
		else if(!(filters instanceof Object)){
			if(typeof(filters) === 'string'){
				this.push(RecordMatcher.genFilter(filters, 'NE', '0'));
				this.push(RecordMatcher.genFilter(filters, 'NN'));
			}
		} else if(!(filters instanceof Array)){
			if(filters instanceof String){
				this.push(RecordMatcher.genFilter(filters, 'NE', '0'));
				this.push(RecordMatcher.genFilter(filters, 'NN'));
			} else if(RecordMatcher.isFilter(filters))
				this.push(filters);
		} else {
			for(var i=0;i<filters.length;i++){
				if(RecordMatcher.isFilter(filters[i]))
					this.push(Object.assign({},filters[i]));
			}
		}
	}
}

RecordMatcher.new = function(filters){
	return new RecordMatcher(filters);
};

RecordMatcher.genFilter = function(field, op, value){
	return {field:field, op:op, value:value};
};

RecordMatcher.VALID_OPS_LIST = ['EQ','NE','GT','GE','LT','LE','NU','NN','LI','NL','MA','NM'];

RecordMatcher.isFilter = function(filter){
	if(filter.op && filter.op.indexOf(RecordMatcher.VALID_OPS_LIST)==-1) return false;
	if(!filter.field) return false;
	return true;
};

RecordMatcher.prototype.setSchema = function(schema){
	if(schema instanceof RecordSchema) this.schema = schema;
};

RecordMatcher.prototype.match = function(record, schema){
	if(!schema && !this.schema) throw new Error('No schema defined');
	if(record instanceof Array) return this.matchAll(record, schema);
	// Match against a single record.
	throw new Error('To be defined');
};

RecordMatcher.prototype.matchAll = function(record, schema){
	if(!schema && !this.schema) throw new Error('No schema defined');
	if(!(record instanceof Array)) return this.match(record, schema);
	for(var i=0;i<record.length;i++){
		if(record[i] instanceof Array){
			if(!this.matchAny(record[i],schema)) return false;
		} else {
			if(!this.match(record[i],schema)) return false;
		}
	}
	return true;
};

RecordMatcher.prototype.matchAny = function(record, schema){
	if(!schema && !this.schema) throw new Error('No schema defined');
	if(!(record instanceof Array)) return this.match(record, schema);
	for(var i=0;i<record.length;i++){
		if(record[i] instanceof Array){
			if(this.matchAll(record[i],schema)) return true;
		} else {
			if(this.match(record[i],schema)) return true;
		}
	}
	return false;
};

RecordMatcher.prototype.and = function(obj){
	
};

RecordMatcher.prototype.or = function(obj){
	
};