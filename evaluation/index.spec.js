const should = require('should');

describe('Testing the JSON Structure', function(err){
  it('Check whether file exists', function(done){
    let user = {type: 'mentors', mentors: ['sagar', 'neelanjan', 'dinesh', 'yogendra']};
    user.should.have.property('type', 'mentors');
    user.should.have.property('mentors').with.lengthOf(4);
    done();
  })
})
