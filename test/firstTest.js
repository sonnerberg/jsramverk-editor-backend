import chai from 'chai'
import chaiHttp from 'chai-http'
import { server } from '../src/index.js'

chai.should()

chai.use(chaiHttp)

describe('Documents', () => {
    let newDocumentId
    describe('Should get all documents', () => {
        it('All document returned', (done) => {
            chai.request(server)
                .get('/api/v1/')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.an('object')
                    res.body.data.should.be.an('array')

                    done()
                })
        })
    })

    describe('Should create a new document and then update it', () => {
        it('Document created', (done) => {
            chai.request(server)
                .post('/api/v1/create')
                .set('content-type', 'application/json')
                .send({ html: '<h1>hello world</h1>', name: 'A test document' })
                .end((err, res) => {
                    res.should.have.status(201)
                    res.body.data.id.should.be.a('string')
                    newDocumentId = res.body.data.id

                    done()
                })
        })
        it('Document updated', (done) => {
            chai.request(server)
                .put('/api/v1/update')
                .set('content-type', 'application/json')
                .send({
                    id: newDocumentId,
                    html: '<h1>hello</h1>',
                    name: 'Another test document',
                })
                .end((err, res) => {
                    res.should.have.status(200)

                    done()
                })
        })
    })

    describe('Should fail to update a non existent document', () => {
        it('Failed to update new document', (done) => {
            chai.request(server)
                .put('/api/v1/update')
                .set('content-type', 'application/json')
                .send({
                    id: 'asdf',
                    html: '<h1>hello</h1>',
                    name: 'Another test document',
                })
                .end((err, res) => {
                    res.should.have.status(500)

                    done()
                })
        })
    })
    describe('Should fail to create a new document', () => {
        it('Failed to create new document', (done) => {
            chai.request(server)
                .post('/api/v1/create')
                .set('content-type', 'application/json')
                .send({ asdf: 'asdf' })
                .end((err, res) => {
                    res.should.have.status(500)

                    done()
                })
        })
    })
})
