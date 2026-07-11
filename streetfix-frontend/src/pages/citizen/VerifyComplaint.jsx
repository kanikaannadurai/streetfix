import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const VerifyComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const response = await api.get(`/complaints/${id}`);
      setComplaint(response.data);
    } catch (err) {
      setError('Failed to fetch complaint details.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (approved) => {
    try {
      await api.post(`/complaints/${id}/verify`, {
        approved,
        remarks
      });
      window.dispatchEvent(new Event('refreshNotifications'));
      setSuccess(`Complaint has been successfully ${approved ? 'approved' : 'rejected'}.`);
      setTimeout(() => navigate('/citizen/dashboard'), 2000);
    } catch (err) {
      setError('Failed to submit verification.');
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Verify Completed Work</h4>
        </Card.Header>
        <Card.Body>
          {success && <Alert variant="success">{success}</Alert>}
          
          <Row className="mb-4">
            <Col md={6}>
              <h5>Before</h5>
              {complaint.beforeImageUrl ? (
                <img src={complaint.beforeImageUrl} alt="Before" className="img-fluid rounded" style={{maxHeight: '300px', width: '100%', objectFit: 'cover'}} />
              ) : (
                <div className="bg-light p-5 text-center text-muted rounded">No Image Provided</div>
              )}
            </Col>
            <Col md={6}>
              <h5>After</h5>
              {complaint.afterImageUrl ? (
                <img src={complaint.afterImageUrl} alt="After" className="img-fluid rounded" style={{maxHeight: '300px', width: '100%', objectFit: 'cover'}} />
              ) : (
                <div className="bg-light p-5 text-center text-muted rounded">No Image Provided</div>
              )}
            </Col>
          </Row>

          <Form className="mt-4">
            <Form.Group className="mb-4">
              <Form.Label><strong>Citizen Remarks</strong></Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                placeholder="Provide your feedback on the work done..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/citizen/dashboard')}>
                Cancel
              </Button>
              <div>
                <Button variant="danger" className="me-2" onClick={() => handleVerify(false)}>
                  Reject Work
                </Button>
                <Button variant="success" onClick={() => handleVerify(true)}>
                  Approve Work
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VerifyComplaint;
