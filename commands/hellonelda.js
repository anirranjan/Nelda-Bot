module.exports = {
    name: 'hellonelda',
    description: 'Nelda will introduce itself',
    execute(message, args){
        message.channel.send('Greetings! I am Nelda, unicorn messenger from Rainbow River HQ');
    }
};