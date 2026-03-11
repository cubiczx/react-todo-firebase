import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import AddTask from "./components/AddTask";
import { db } from "./utils/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import TaskComponent from "./components/Task";

import "./App.scss";

interface Task {
  id: string;
  name: string;
  done: boolean;
  created?: any;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reloadTask, setReloadTask] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "tasks"),
          orderBy("done", "asc"),
          orderBy("created", "desc")
        );
        const querySnapshot = await getDocs(q);
        const tasksData = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Task,
        );
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      } finally {
        setLoading(false);
      }
    };
    setReloadTask(false);
    fetchTasks();
  }, [reloadTask]);

  return (
    <Container fluid className="app">
      <div className="title">
        <h1>Listado de tareas de Xavier Palacín Ayuso</h1>
      </div>
      <Row className="todo">
        <Col
          xs={{ span: 10, offset: 1 }}
          md={{ span: 6, offset: 3 }}
          className="todo__title"
        >
          <h2>Today</h2>
        </Col>
        <Col
          xs={{ span: 10, offset: 1 }}
          md={{ span: 6, offset: 3 }}
          className="todo__list"
        >
          {loading ? (
            <div className="loading">
              <Spinner animation="border" role="status"/>
              <span>Loading...</span>
            </div>
          ) : tasks.length === 0 ? (
            <h3>No task found</h3>
          ) : (
            tasks.map((task) => (
              <TaskComponent
                key={task.id}
                task={task}
                setReloadTask={setReloadTask}
              />
            ))
          )}
        </Col>
        <Col
          xs={{ span: 10, offset: 1 }}
          md={{ span: 6, offset: 3 }}
          className="todo__input"
        >
          <AddTask setReloadTask={setReloadTask} />
        </Col>
      </Row>
    </Container>
  );
}
