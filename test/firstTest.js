import chai from 'chai'
import chaiHttp from 'chai-http'
import { server } from '../src/index.js'

chai.should()

chai.use(chaiHttp)

describe('Documents', () => {
    describe('GET all documents', () => {
        it('200 HAPPY PATH', (done) => {
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
})
