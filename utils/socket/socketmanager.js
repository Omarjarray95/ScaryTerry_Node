var Impediment = require('../../models/Impediment');
var Project = require ('../../models/Project')
var moment = require('moment');
module.exports = function(server) {

    const io = require('socket.io').listen(server)
    var participants = []

    io.on('connection', function(socket) {
        console.log("new one here , congrats !")
        var client = {};
        socket.on('new participant', function(name) {
            // push to participant list
            name.cid=socket.id;
            participants.push(name);
            //update new client, this is used to track the client while disconnecting
            client.name = name;
            client.cid=socket.id;
            client.socket = socket;
            console.log(new Date() + ' ' + name.name + ' connected'+JSON.stringify(socket.id));
            // broadcast new user notification
                        console.log(JSON.stringify(name))

                        Project.find({
                            $and: [{
                                    startDate: {
                                        $lte: Date.now()
                                    }
                                },
                                {
                                    endDate: {
                                        $gte: Date.now()
                                    }
                                },
                                {
                                    'scrumMaster': name.uid
                                }
                            ]
                        }, function(err, ps) {
                            



                 
                                        Project.populate(ps, {path: "sprints"}, 
                                            function(err,p )
                                            {
                                                if (err) throw err;
                                                // console.log(p);
                                                console.log("here : "+p.length)
                                                 if (p.length != 0) {
                     
                                                     if(p[0].sprints.length!=0)
                                                     {   console.log(p[0])
                                                         p[0].sprints.map(
                                                             y=>     { console.log(y);
                                                                 if(
                                                                     
                                                                    ( moment(y.startDate).add(y.duration, 'days')>moment()))
                                                             {  console.log(true)
                                                                 io.to(`${socket.id}`).emit('Hello',{'scrummaster':true,'actualsprint':y._id} );
                                                                 }
                                                             else{
                                                                 console.log(y);
                                                             }
                                                             }
                                                         )
                                                     }
                                                     else{
                                                        io.to(`${socket.id}`).emit('Hello',{'scrummaster':true,'actualsprint':'naa'});

                                                     }
                     
                                                 } else {
                                                     io.to(`${socket.id}`).emit('Hello', {'scrummaster':false,'actualsprint':'nada2'});
                     
                                                 }
                                            });
                       





 
                        });
              

        });
        socket.on('chat message', function(data) {
            socket.broadcast.emit('chat message', data);
        });
        socket.on('answer', function(data) {
            
            Impediment.findOne({
                _id: data.imp
            }).exec(function(err, impediment) {
                if (err&&(impediment.important_by.length==0)) {
                    res.send("Couldn't find impediment.");
                } else {console.log(participants);
                
                 impediment.important_by.map(x =>       
                            participants.map(y=>     { 
                                if(y.uid==x._id){
                                    io.to(`${y.cid}`).emit('newAnswer','"'+impediment.name+'" Have a new solution , check issuesHUB for more info.');
                                        console.log(y.cid)
                                }}
                                )
                        //console.log('test')
                    );
           //        console.log(impediment.important_by.map('test'));
                    //res.json(impediment);
                }
            });


//            console.log("imp = "+data.imp);
            socket.broadcast.emit('chat message', data);
        });
        socket.on('typing', function(name) {
            socket.broadcast.emit('typing', name);
        });
        socket.on('stoppedTyping', function(name) {
            socket.broadcast.emit('stoppedTyping', name);
        });
        socket.on('removeTyping', function(name) {
            socket.broadcast.emit('removeTyping', name);
        });
        socket.on('disconnect', function() {
            /*if (client.name == undefined) {
              // do nothing, client disconnected before joining chat
            } else {
              console.log(new Date() + ' ' + client.name + ' disconnected');
              // remove from participants list
              participants.splice(participants.indexOf(client.name), 1);
              // broadcast to other participants
              socket.broadcast.emit('disconnected', client.name);
            }*/
            console.log('Disconnected.')
        });
    });
}