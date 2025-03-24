import { Modal, Button } from "react-bootstrap";
import "./confirmvotemodal.css";

export default function ConfirmVoteModal({
  show,
  candidate,
  category,
  onConfirm,
  onClose,
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title>Confirm your Vote</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">
        Are you sure you want to vote for <strong>{candidate}</strong> as{" "}
        <strong>{category}</strong>?
      </Modal.Body>
      <Modal.Footer className="custom-modal-footer">
        <Button variant="outline-secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Yes, Vote
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
