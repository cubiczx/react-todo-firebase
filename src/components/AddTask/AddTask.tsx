import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { ReactComponent as SendIcon } from "../../assets/svg/send.svg";
import { isEmpty } from "lodash";
import { db } from "../../utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import "./AddTask.scss";

export default function AddTask(props: any) {
  const { setReloadTask } = props;
  const [task, setTask] = useState("");

  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (!isEmpty(task)) {
      try {
        await addDoc(collection(db, "tasks"), {
          name: task,
          done: false,
          created: serverTimestamp(),
        });
        console.log("Task added successfully");
        setTask("");
        setReloadTask(true);
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    }
  };

  return (
    <Form onSubmit={onSubmit} className="add-task">
      <Form.Group controlId="formNewTask">
        <Form.Control
          type="text"
          placeholder="New task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        <SendIcon />
      </Button>
    </Form>
  );
}
