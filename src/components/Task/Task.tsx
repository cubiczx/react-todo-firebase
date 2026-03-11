import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { ReactComponent as Check } from "../../assets/svg/check.svg";
import { ReactComponent as Delete } from "../../assets/svg/delete.svg";
import { db } from "../../utils/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

import "./Task.scss";

export default function Task(props: any) {
  const { task, setReloadTask } = props;
  const [showModal, setShowModal] = useState(false);

  const completeTask = async () => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        done: !task.done
      });
      setReloadTask(true);
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const deleteTask = async () => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await deleteDoc(taskRef);
      setShowModal(false);
      setReloadTask(true);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  return (
    <>
      <div className="task">
        <div>
          <Check onClick={completeTask} className={task.done ? "done" : ""}/>
        </div>
        <div>
          {task.name}
        </div>
        <div>
          <Delete onClick={handleDeleteClick}/>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the task "{task.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteTask}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
