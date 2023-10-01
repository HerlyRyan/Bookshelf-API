const { nanoid } = require('nanoid')
const books = require('./books')

// Handler untuk menambahkan data buku
const addBooksHandler = (request, h) => {
    // Membuat variabel input
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    // Kondisi jika variabel name tidak diisi
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }
    // Kondisi jika variabel readPage lebih besar dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    const id = nanoid(16) // Untuk membuat id menggunakan nanoid
    const finished = pageCount === readPage // variabel finished bernilai true jika kedua variabel tersebut bernilai sama
    // Membuat variabel untuk tanggal
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    // Variabel untuk mengumpulkan variabel sebelumnya untuk dimasukkan ke array books
    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt
    }

    books.push(newBook) // Menambahkan variabel newBook ke dalam array books menggunakan push()

    // isSuccess untuk mengecek apakah newBook sudah masuk ke array books
    const isSuccess = books.filter((book) => book.id === id).length > 0
    // Kondisi jika isSuccess bernilai true
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        })
        response.code(201)
        return response
    }
}

// Handler untuk mendapatkan semua buku yang diinput
const getAllBooksHandler = (request, h) => {
    // Membuat variabel untuk mengambil object data buku dengan request query untuk pengambilan data sesuai permintaan
    const { name, finished, reading } = request.query

    // Untuk mendapatkan semua buku tanpa terkecuali
    if (!name && !reading && !finished) {
        const response = h.response({
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        })
        response.code(200)
        return response
    }
    // Untuk mendapatkan data buku dengan query name
    if (name) {
        const filteredByName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()) !== false)
        const response = h.response({
            status: 'success',
            data: {
                books: filteredByName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        })
        response.code(200)
        return response
    }
    // Untuk mendapatkan buku dengan query reading
    if (reading) {
        const filteredByReading = books.filter((book) => Number(book.reading) === Number(reading))
        const response = h.response({
            status: 'success',
            data: {
                books: filteredByReading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        })
        response.code(200)
        return response
    }
    // Untuk mendapatkan buku dengan query finished
    if (finished) {
        const filteredByFinished = books.filter((book) => Number(book.finished) === Number(finished))
        const response = h.response({
            status: 'success',
            data: {
                books: filteredByFinished.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        })
        response.code(200)
        return response
    }
}

// Handler untuk mendapatkan buku menggunakan Id
const getBookByIdHandler = (request, h) => {
    // Membuat variabel bookId dengan request params untuk mengambil object data book.id
    const { bookId } = request.params

    // Membuat variabel book untuk mencari object book.id
    const book = books.filter((n) => n.id === bookId)[0]
    // response ketika buku berhasil ditemukan dan tidak bernilai kosong atau undefined
    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book
            }
        })
        response.code(200)
        return response
    }
    // response jika buku tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
}

// Handler untuk mengedit data buku
const editBookByIdHandler = (request, h) => {
    // Membuat variabel untuk mendapatkan data buku dari id sampai ke reading
    const { bookId } = request.params
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    // Kondisi jika variabel name tidak ada
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }
    // Kondisi jika variabel readPage lebih besar dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    // Untuk mendapatkan index array dari object data buku
    const index = books.findIndex((book) => book.id === bookId)
    // Kondisi jika index bernilai true
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })
        response.code(200)
        return response
    }
    // Response ketika gagal memperbarui buku karena id tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

const deleteBookByIdHandler = (request, h) => {
    // Variabel untuk mengambil data book.id
    const { bookId } = request.params
    // Variabel untuk mendapatkan array object data book.id
    const index = books.findIndex((book) => book.id === bookId)

    // Percabangan untuk mengecek lalu menghapus buku
    if (index !== -1) {
        books.splice(index, 1)
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200)
        return response
    }
    // Response ketika gagal menghapus buku
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
}