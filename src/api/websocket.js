import io from 'socket.io'

const socket = io(process.env.REACT_APP_SERVER_URL) // endpoint a.k.a  namespace

export default socket
