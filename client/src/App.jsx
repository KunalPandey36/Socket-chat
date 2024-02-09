import React, { useEffect, useMemo } from 'react'
import { io } from "socket.io-client"
import { Button, Form, Input } from "antd"
import { Stack } from '@mui/system';


function App() {

  const [message, setMessage] = React.useState('');
  const [recieveMessage, setRecieveMessage] = React.useState([]);
  const [socketId, setSocketId] = React.useState('');
  const socket = useMemo(() =>
    io('http://localhost:3000')
    , [])

  const handleSubmit = (values) => {
    const newM = values.message;
    const newR = values.room;
    socket.emit("message", { newM, newR });

  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected", socket.id);
      setSocketId(socket.id)
    })

    socket.on("recieve-message", (data) => {
      // console.log("recieve-message: ",data)
      setRecieveMessage((recieveMessage) => [...recieveMessage, data]);

    })

    return () => {
      socket.disconnect();
    }
  }, [])
  return (
    <div>
      <h1>{socketId}</h1>
      <Form onFinish={handleSubmit} layout='vertical'>
        <Form.Item label="Message" name='message'>
          <Input placeholder='Enter the message' />
        </Form.Item>
        <Form.Item label="Room" name='room'>
          <Input placeholder='Enter the room name' />
        </Form.Item>

        <Button htmlType='submit' type='primary'>Submit</Button>
      </Form>
      {console.log(recieveMessage)}
      <Stack>
        {recieveMessage.map((m, index) => {
          return (
            <h1 key={index}>
              {m}
            </h1>
          );
        })}
      </Stack>

    </div>
  )
}

export default App