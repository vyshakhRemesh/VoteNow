import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import "./candidates.css";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Chairman",
    description: "",
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [selectedCategory, candidates]);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/candidates");
      setCandidates(res.data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  const filterCandidates = () => {
    if (selectedCategory === "All") {
      setFilteredCandidates(candidates);
    } else {
      setFilteredCandidates(
        candidates.filter(
          (candidate) => candidate.category === selectedCategory
        )
      );
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editingCandidate) {
        await axios.put(
          `http://localhost:5000/api/candidates/${editingCandidate._id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5000/api/candidates", formData);
      }
      fetchCandidates();
      setShowModal(false);
      setEditingCandidate(null);
      setFormData({ name: "", category: "Chairman", description: "" });
    } catch (err) {
      console.error("Error saving candidate:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/candidates/${id}`);
      fetchCandidates();
    } catch (err) {
      console.error("Error deleting candidate:", err);
    }
  };

  return (
    <div className="candidates-container mt-4">
      <h2>Candidates</h2>
      <div className="candidates-header">
        <Button
          className="btn-primary"
          onClick={() => {
            setEditingCandidate(null);
            setFormData({ name: "", category: "Chairman", description: "" });
            setShowModal(true);
          }}
        >
          Add Candidate
        </Button>

        {/* Category Filter Dropdown */}
        <Form.Select
          className="form-select filter-dropdown"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Chairman">Chairman</option>
          <option value="Counselor">Counselor</option>
          <option value="Arts Secretary">Arts Secretary</option>
          <option value="Sports Captain">Sports Captain</option>
          <option value="Cultural Coordinator">Cultural Coordinator</option>
          <option value="Technical Lead">Technical Lead</option>
        </Form.Select>
      </div>

      {/* Candidates Table */}
      <Table striped bordered hover className="mt-3 table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <tr key={candidate._id}>
                <td>{candidate.name}</td>
                <td>{candidate.category}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="btn-warning"
                    onClick={() => {
                      setEditingCandidate(candidate);
                      setFormData({
                        name: candidate.name,
                        category: candidate.category,
                        description: candidate.description,
                      });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    className="btn-danger"
                    onClick={() => handleDelete(candidate._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No candidates found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Add/Edit Candidate Modal */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCandidate ? "Edit Candidate" : "Add Candidate"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Chairman">Chairman</option>
                <option value="Counselor">Counselor</option>
                <option value="Arts Secretary">Arts Secretary</option>
                <option value="Sports Captain">Sports Captain</option>
                <option value="Cultural Coordinator">
                  Cultural Coordinator
                </option>
                <option value="Technical Lead">Technical Lead</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingCandidate ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Candidates;
