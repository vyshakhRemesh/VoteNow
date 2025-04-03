import { Modal, Button } from "react-bootstrap";
import "./confirmvotemodal.css";

export default function ConfirmVoteModal({
  show,
  candidate,
  category,
  description,
  onConfirm,
  onClose,
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title>Confirm your Vote</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">
        <p>
          Are you sure you want to vote for <strong>{candidate}</strong> as{" "}
          <strong>{category}</strong>?
        </p>
        {description && (
          <div className="candidate-description">
            <strong>About {candidate}:</strong>
            <p>{description}</p>
          </div>
        )}
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
