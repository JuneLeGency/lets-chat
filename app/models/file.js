'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    base64_encode = require('base64').encode,
    ObjectId = Schema.ObjectId;

var FileSchema = new Schema({
    room: {
        type: ObjectId,
        ref: 'Room',
        required: true
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    uploaded: {
        type: Date,
        default: Date.now
    }
});

FileSchema.virtual('url').get(function(file) {
    return 'files/' + this._id + '/' + encodeURIComponent(this.name);
});

FileSchema.method('toJSON', function() {
    return {
        id: this._id,
        room: this.room,
        owner: this.owner,
        name: this.name,
        type: this.type,
        size: Math.floor(this.size / 1024) + 'kb',
        url: this.url,
        url_mi:"http://d.miwifi.com/d2r/?url=" +
        base64_encode('http://note.letvr.com/'+this.url) + "&src=demo",
        uploaded: this.uploaded
    };
});

module.exports = mongoose.model('File', FileSchema);
