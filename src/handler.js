const { nanoid } = require("nanoid");
const notes = require('./notes');

const addNoteHandler = (request,  h) => {
    const {title, tags, body} = request.payload; //di dapat dari client
    
    const id = nanoid(16); // kita dapat dari setting sendiri
    const createdAt = new Date() .toISOString();
    const updatedAt = createdAt;

    

    const newNote = {
        id, title, createdAt, updatedAt, tags, body, 
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message : 'catatan berhasil ditambahkan',
            data : {
                noteId: id,
            }
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    }
});

const getNoteByIdHandler = (request, h) =>{
    const {id} = request.params;
    const note = notes.filter((n) => n.id === id);

    if(note !== undefined){
        return {
            status: 'success',
            data: {
                note : note[0],
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'catatan tidak ditemukan'
    });

    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) =>{
    const { id } = request.params;

    const {title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] ={
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };
        const response = h.response({
            status :'success',
            message: 'catatan berhasil diperbarui'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status : 'fail',
        message: 'gagal memperbarui catatan, id tidak ditemukan',
    });
    response.code(400);
    return response
};

const deleteNoteByIdHandler = (request, h) =>{
    const {id} = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'catatan berhasil dihapus',
        });
        response.code(200);
        return response;
        
    }

    const response = h.response({
        status : 'fail',
        message : 'catatan gagal dihapus, catatan tidak ditemukan',
    });
    response.code(400);
    return response;
}

module.exports = {addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler};